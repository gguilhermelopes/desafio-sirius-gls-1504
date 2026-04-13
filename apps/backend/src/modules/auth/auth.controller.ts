import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthUserResponseDto } from './dto/auth-user.response';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { setAuthCookies } from './utils/auth-cookies';

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

  @Get('me')
  me() {
    throw new UnauthorizedException();
  }
}
