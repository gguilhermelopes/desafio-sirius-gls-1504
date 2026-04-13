import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { REFRESH_TOKEN_COOKIE_NAME } from './auth.constants';
import { AuthService } from './auth.service';
import { AuthUserResponseDto } from './dto/auth-user.response';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { clearAuthCookies, setAuthCookies } from './utils/auth-cookies';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthUserResponseDto> {
    const result = await this.authService.register(dto);

    setAuthCookies(response, result.accessToken, result.refreshToken, {
      accessTokenTtl: this.configService.getOrThrow<string>(
        'auth.accessTokenTtl',
      ),
      domain: this.configService.get<string>('auth.cookieDomain'),
      refreshTokenTtlDays: this.configService.getOrThrow<number>(
        'auth.refreshTokenTtlDays',
      ),
      secure: this.configService.getOrThrow<boolean>('auth.cookieSecure'),
    });

    return result.user;
  }

  @Post('login')
  @HttpCode(201)
  @UseGuards(ThrottlerGuard)
  @Throttle({
    default: {
      getTracker: (request: { body?: { email?: unknown }; ip?: string }) => {
        const email = getRequestBodyEmail(request);

        return email ? email.trim().toLowerCase() : (request.ip ?? 'unknown');
      },
      limit: 5,
      ttl: 60_000,
    },
  })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthUserResponseDto> {
    const result = await this.authService.login(dto);

    setAuthCookies(response, result.accessToken, result.refreshToken, {
      accessTokenTtl: this.configService.getOrThrow<string>(
        'auth.accessTokenTtl',
      ),
      domain: this.configService.get<string>('auth.cookieDomain'),
      refreshTokenTtlDays: this.configService.getOrThrow<number>(
        'auth.refreshTokenTtlDays',
      ),
      secure: this.configService.getOrThrow<boolean>('auth.cookieSecure'),
    });

    return result.user;
  }

  @Post('refresh')
  @HttpCode(201)
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthUserResponseDto> {
    const result = await this.authService.refresh(
      getCookieValue(request, REFRESH_TOKEN_COOKIE_NAME),
    );

    setAuthCookies(response, result.accessToken, result.refreshToken, {
      accessTokenTtl: this.configService.getOrThrow<string>(
        'auth.accessTokenTtl',
      ),
      domain: this.configService.get<string>('auth.cookieDomain'),
      refreshTokenTtlDays: this.configService.getOrThrow<number>(
        'auth.refreshTokenTtlDays',
      ),
      secure: this.configService.getOrThrow<boolean>('auth.cookieSecure'),
    });

    return result.user;
  }

  @Post('logout')
  @HttpCode(201)
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.logout(
      getCookieValue(request, REFRESH_TOKEN_COOKIE_NAME),
    );

    clearAuthCookies(response, {
      domain: this.configService.get<string>('auth.cookieDomain'),
      secure: this.configService.getOrThrow<boolean>('auth.cookieSecure'),
    });

    return { success: true };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(
    @CurrentUser()
    user: {
      email: string;
      id: string;
      sessionId: string;
    },
  ): Promise<AuthUserResponseDto> {
    return this.authService.me({
      id: user.id,
      sessionId: user.sessionId,
    });
  }
}

function getCookieValue(request: Request, name: string) {
  const cookies = request.cookies as Record<string, string | undefined>;

  return cookies[name];
}

function getRequestBodyEmail(request: { body?: { email?: unknown } }) {
  return typeof request.body?.email === 'string'
    ? request.body.email
    : undefined;
}
