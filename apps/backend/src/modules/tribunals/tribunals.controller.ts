import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TribunalsRepository } from './tribunals.repository';

@Controller('tribunals')
export class TribunalsController {
  constructor(private readonly tribunalsRepository: TribunalsRepository) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    const items = await this.tribunalsRepository.findAll();
    return { items };
  }
}
