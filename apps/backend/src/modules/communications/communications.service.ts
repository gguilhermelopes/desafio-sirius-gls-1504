import { Injectable, NotFoundException } from '@nestjs/common';
import { CommunicationsRepository } from './communications.repository';

@Injectable()
export class CommunicationsService {
  constructor(private readonly repository: CommunicationsRepository) {}

  findPaginated(params: {
    page: number;
    search?: string;
    tribunalId?: number;
    startDate?: string;
    endDate?: string;
  }) {
    return this.repository.findPaginated(params);
  }

  async findProcessByNumber(number: string) {
    const result = await this.repository.findProcessByNumber(number);
    if (!result) {
      throw new NotFoundException(`Process ${number} not found`);
    }
    return result;
  }

  findCommunicationById(id: string) {
    return this.repository.findCommunicationById(id);
  }

  saveSummary(id: string, summary: string) {
    return this.repository.saveSummary(id, summary);
  }
}
