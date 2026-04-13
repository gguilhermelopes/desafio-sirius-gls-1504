import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import {
  randomBytes,
  randomUUID,
  scrypt as scryptCallback,
  timingSafeEqual,
} from 'node:crypto';
import { promisify } from 'node:util';
import {
  PASSWORD_HASH_DIGEST,
  PASSWORD_HASH_KEY_LENGTH,
  PASSWORD_HASH_SALT_LENGTH,
} from './auth.constants';
import { AuthUserResponseDto } from './dto/auth-user.response';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthRepository } from './repositories/auth.repository';

const scrypt = promisify(scryptCallback);
const MS_PER_DAY = 24 * 60 * 60 * 1000;

type SessionResult = {
  user: AuthUserResponseDto;
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<SessionResult> {
    if (dto.password !== dto.passwordConfirmation) {
      throw new ConflictException('Password confirmation mismatch');
    }

    const refreshToken = randomUUID();
    const refreshTokenTtlDays = this.configService.getOrThrow<number>(
      'auth.refreshTokenTtlDays',
    );
    const expiresAt = new Date(Date.now() + refreshTokenTtlDays * MS_PER_DAY);

    try {
      const user = await this.authRepository.createUserWithRefreshSession({
        user: {
          email: dto.email,
          name: dto.name,
          passwordHash: await hashSecret(dto.password),
        },
        refreshSession: {
          expiresAt,
          tokenHash: await hashSecret(refreshToken),
        },
      });

      return {
        accessToken: await this.signAccessToken({
          email: user.email,
          id: user.id,
          name: user.name,
        }),
        refreshToken,
        user: {
          email: user.email,
          id: user.id,
          name: user.name,
        },
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email already in use');
      }

      throw error;
    }
  }

  async login(dto: LoginDto): Promise<SessionResult> {
    const user = await this.authRepository.findUserByEmail(dto.email);

    if (!user || !(await verifySecret(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.createSession({
      email: user.email,
      id: user.id,
      name: user.name,
    });
  }

  private async createSession(
    user: AuthUserResponseDto,
  ): Promise<SessionResult> {
    const refreshToken = randomUUID();
    const refreshTokenTtlDays = this.configService.getOrThrow<number>(
      'auth.refreshTokenTtlDays',
    );
    const expiresAt = new Date(Date.now() + refreshTokenTtlDays * MS_PER_DAY);

    await this.authRepository.createRefreshSession({
      expiresAt,
      tokenHash: await hashSecret(refreshToken),
      userId: user.id,
    });

    return {
      accessToken: await this.signAccessToken(user),
      refreshToken,
      user,
    };
  }

  private signAccessToken(user: AuthUserResponseDto) {
    return this.jwtService.signAsync(
      { email: user.email, sub: user.id },
      {
        expiresIn: this.configService.getOrThrow<string>('auth.accessTokenTtl'),
      },
    );
  }
}

async function hashSecret(secret: string): Promise<string> {
  const salt = randomBytes(PASSWORD_HASH_SALT_LENGTH).toString('hex');
  const derivedKey = (await scrypt(
    secret,
    salt,
    PASSWORD_HASH_KEY_LENGTH,
  )) as Buffer;

  return [PASSWORD_HASH_DIGEST, salt, derivedKey.toString('hex')].join(':');
}

async function verifySecret(
  secret: string,
  storedHash: string,
): Promise<boolean> {
  const [digest, salt, expectedHash] = storedHash.split(':');

  if (!digest || !salt || !expectedHash || digest !== PASSWORD_HASH_DIGEST) {
    return false;
  }

  const derivedKey = (await scrypt(
    secret,
    salt,
    PASSWORD_HASH_KEY_LENGTH,
  )) as Buffer;
  const expectedBuffer = Buffer.from(expectedHash, 'hex');

  if (expectedBuffer.length !== derivedKey.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, derivedKey);
}
