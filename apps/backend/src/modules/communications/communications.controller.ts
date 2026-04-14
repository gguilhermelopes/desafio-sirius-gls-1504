import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SummaryService } from '../summary/summary.service';
import { CommunicationsService } from './communications.service';
import { CommunicationsQueryDto } from './dto/communications-query.dto';

@Controller('communications')
@UseGuards(JwtAuthGuard)
export class CommunicationsController {
  constructor(
    private readonly communicationsService: CommunicationsService,
    private readonly summaryService: SummaryService,
  ) {}

  @Get()
  findAll(@Query() query: CommunicationsQueryDto) {
    return this.communicationsService.findPaginated({
      page: query.page ?? 1,
      search: query.search,
      tribunalId: query.tribunalId,
      startDate: query.startDate,
      endDate: query.endDate,
    });
  }

  @Get('process/:number')
  findProcessByNumber(@Param('number') number: string) {
    return this.communicationsService.findProcessByNumber(number);
  }

  @Post(':id/summary')
  async generateSummary(@Param('id') id: string) {
    const communication =
      await this.communicationsService.findCommunicationById(id);

    if (!communication) {
      throw new NotFoundException('Communication not found');
    }

    if (communication.aiSummary) {
      return { summary: communication.aiSummary, cached: true };
    }

    const summary = await this.summaryService.generateSummary(
      communication.content,
    );
    await this.communicationsService.saveSummary(id, summary);

    return { summary, cached: false };
  }
}
