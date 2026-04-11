import { Controller, Get, UnauthorizedException } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Get('me')
  me() {
    throw new UnauthorizedException();
  }
}
