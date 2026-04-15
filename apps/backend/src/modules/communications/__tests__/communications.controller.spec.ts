import { NotFoundException } from '@nestjs/common';
import { SummaryService } from '../../summary/summary.service';
import { CommunicationsController } from '../communications.controller';
import { CommunicationsService } from '../communications.service';

describe('CommunicationsController', () => {
  it('should map query params when listing communications', async () => {
    const communicationsService = {
      findPaginated: jest.fn().mockResolvedValue({ items: [], meta: { page: 1 } }),
    };
    const controller = new CommunicationsController(
      communicationsService as unknown as CommunicationsService,
      {} as SummaryService,
    );

    await controller.findAll({
      page: undefined,
      search: '123',
      tribunalId: 10,
      startDate: '2026-04-01',
      endDate: '2026-04-14',
    });

    expect(communicationsService.findPaginated).toHaveBeenCalledWith({
      page: 1,
      search: '123',
      tribunalId: 10,
      startDate: '2026-04-01',
      endDate: '2026-04-14',
    });
  });

  it('should return the cached summary without generating a new one', async () => {
    const communicationsService = {
      findCommunicationById: jest.fn().mockResolvedValue({
        id: 'comm-1',
        content: 'conteudo',
        aiSummary: 'Resumo salvo',
      }),
      saveSummary: jest.fn(),
    };
    const summaryService = {
      generateSummary: jest.fn(),
    };
    const controller = new CommunicationsController(
      communicationsService as unknown as CommunicationsService,
      summaryService as unknown as SummaryService,
    );

    await expect(controller.generateSummary('comm-1')).resolves.toEqual({
      summary: 'Resumo salvo',
      cached: true,
    });
    expect(summaryService.generateSummary).not.toHaveBeenCalled();
    expect(communicationsService.saveSummary).not.toHaveBeenCalled();
  });

  it('should generate and persist a summary when none is cached', async () => {
    const communicationsService = {
      findCommunicationById: jest.fn().mockResolvedValue({
        id: 'comm-1',
        content: 'conteudo',
        aiSummary: null,
      }),
      saveSummary: jest.fn().mockResolvedValue(undefined),
    };
    const summaryService = {
      generateSummary: jest.fn().mockResolvedValue('Resumo novo'),
    };
    const controller = new CommunicationsController(
      communicationsService as unknown as CommunicationsService,
      summaryService as unknown as SummaryService,
    );

    await expect(controller.generateSummary('comm-1')).resolves.toEqual({
      summary: 'Resumo novo',
      cached: false,
    });
    expect(summaryService.generateSummary).toHaveBeenCalledWith('conteudo');
    expect(communicationsService.saveSummary).toHaveBeenCalledWith(
      'comm-1',
      'Resumo novo',
    );
  });

  it('should throw when the communication does not exist', async () => {
    const controller = new CommunicationsController(
      {
        findCommunicationById: jest.fn().mockResolvedValue(null),
      } as unknown as CommunicationsService,
      {} as SummaryService,
    );

    await expect(controller.generateSummary('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
