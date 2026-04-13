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

type SessionAwareUser = AuthUserResponseDto & {
  sessionId: string;
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

    const refreshTokenParts = await createRefreshTokenParts();
    const refreshTokenTtlDays = this.configService.getOrThrow<number>(
      'auth.refreshTokenTtlDays',
    );
    const expiresAt = new Date(Date.now() + refreshTokenTtlDays * MS_PER_DAY);

    try {
      const { refreshSession, user } =
        await this.authRepository.createUserWithRefreshSession({
          user: {
            email: dto.email,
            name: dto.name,
            passwordHash: await hashSecret(dto.password),
          },
          refreshSession: {
            expiresAt,
            tokenHash: refreshTokenParts.hash,
          },
        });

      return {
        accessToken: await this.signAccessToken({
          email: user.email,
          id: user.id,
          name: user.name,
          sessionId: refreshSession.id,
        }),
        refreshToken: buildRefreshToken(
          refreshSession.id,
          refreshTokenParts.secret,
        ),
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

  async me(user: {
    id: string;
    sessionId: string;
  }): Promise<AuthUserResponseDto> {
    const session = await this.authRepository.findActiveSessionById(
      user.sessionId,
    );

    if (
      !session ||
      session.userId !== user.id ||
      session.expiresAt <= new Date()
    ) {
      throw new UnauthorizedException('Invalid session');
    }

    const currentUser = await this.authRepository.findUserById(user.id);

    if (!currentUser) {
      throw new UnauthorizedException('User not found');
    }

    return {
      email: currentUser.email,
      id: currentUser.id,
      name: currentUser.name,
    };
  }

  async refresh(refreshCookie?: string): Promise<SessionResult> {
    const parsedToken = parseRefreshToken(refreshCookie);

    if (!parsedToken) {
      throw new UnauthorizedException('Invalid session');
    }

    const session = await this.authRepository.findActiveSessionById(
      parsedToken.sessionId,
    );

    if (
      !session ||
      session.expiresAt <= new Date() ||
      !(await verifySecret(parsedToken.secret, session.tokenHash))
    ) {
      throw new UnauthorizedException('Invalid session');
    }

    const user = await this.authRepository.findUserById(session.userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const refreshTokenParts = await createRefreshTokenParts();
    const refreshTokenTtlDays = this.configService.getOrThrow<number>(
      'auth.refreshTokenTtlDays',
    );
    const expiresAt = new Date(Date.now() + refreshTokenTtlDays * MS_PER_DAY);
    const newSession = await this.authRepository.rotateRefreshSession({
      currentSessionId: session.id,
      newSession: {
        expiresAt,
        tokenHash: refreshTokenParts.hash,
        userId: user.id,
      },
    });

    if (!newSession) {
      throw new UnauthorizedException('Invalid session');
    }

    return {
      accessToken: await this.signAccessToken({
        email: user.email,
        id: user.id,
        name: user.name,
        sessionId: newSession.id,
      }),
      refreshToken: buildRefreshToken(newSession.id, refreshTokenParts.secret),
      user: {
        email: user.email,
        id: user.id,
        name: user.name,
      },
    };
  }

  async logout(refreshCookie?: string): Promise<void> {
    const parsedToken = parseRefreshToken(refreshCookie);

    if (!parsedToken) {
      return;
    }

    const session = await this.authRepository.findActiveSessionById(
      parsedToken.sessionId,
    );

    if (!session) {
      return;
    }

    if (!(await verifySecret(parsedToken.secret, session.tokenHash))) {
      return;
    }

    await this.authRepository.revokeSession(session.id);
  }

  private async createSession(
    user: AuthUserResponseDto,
  ): Promise<SessionResult> {
    const refreshTokenParts = await createRefreshTokenParts();
    const refreshTokenTtlDays = this.configService.getOrThrow<number>(
      'auth.refreshTokenTtlDays',
    );
    const expiresAt = new Date(Date.now() + refreshTokenTtlDays * MS_PER_DAY);

    const session = await this.authRepository.createRefreshSession({
      expiresAt,
      tokenHash: refreshTokenParts.hash,
      userId: user.id,
    });

    return {
      accessToken: await this.signAccessToken({
        ...user,
        sessionId: session.id,
      }),
      refreshToken: buildRefreshToken(session.id, refreshTokenParts.secret),
      user,
    };
  }

  private signAccessToken(user: SessionAwareUser) {
    return this.jwtService.signAsync(
      {
        email: user.email,
        sid: user.sessionId,
        sub: user.id,
      },
      {
        expiresIn: this.configService.getOrThrow<string>('auth.accessTokenTtl'),
      },
    );
  }
}

async function createRefreshTokenParts(): Promise<{
  hash: string;
  secret: string;
}> {
  const secret = randomUUID();

  return {
    hash: await hashSecret(secret),
    secret,
  };
}

function buildRefreshToken(sessionId: string, secret: string) {
  return `${sessionId}.${secret}`;
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

function parseRefreshToken(
  refreshToken?: string,
): { secret: string; sessionId: string } | null {
  if (!refreshToken) {
    return null;
  }

  const [sessionId, secret, ...rest] = refreshToken.split('.');

  if (!sessionId || !secret || rest.length > 0) {
    return null;
  }

  return { secret, sessionId };
}
