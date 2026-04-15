import { CommunicationsRepository } from '../communications.repository';

describe('CommunicationsRepository', () => {
  describe('findProcessByNumber', () => {
    it('should return process details with distinct recipients and ordered communications', async () => {
      const processFindUnique = jest.fn().mockResolvedValue({
        number: '123',
        className: 'Cumprimento de sentença',
        hasTransitado: true,
        tribunal: { sigla: 'TJSP' },
      });
      const communicationFindMany = jest.fn().mockResolvedValue([
        {
          id: 'comm-2',
          publicationDate: new Date('2026-04-14T12:00:00.000Z'),
          type: 'DECISAO',
          content: 'Conteúdo 2',
          aiSummary: 'Resumo 2',
          recipients: [{ name: 'Maria', type: 'PARTY', role: 'AUTORA' }],
        },
        {
          id: 'comm-1',
          publicationDate: new Date('2026-04-13T12:00:00.000Z'),
          type: 'DESPACHO',
          content: 'Conteúdo 1',
          aiSummary: null,
          recipients: [{ name: 'João', type: 'LAWYER', role: null }],
        },
      ]);
      const recipientFindMany = jest.fn().mockResolvedValue([
        { name: 'Maria' },
        { name: 'João' },
      ]);
      const repository = new CommunicationsRepository({
        process: { findUnique: processFindUnique },
        communication: { findMany: communicationFindMany },
        recipient: { findMany: recipientFindMany },
      } as never);

      const result = await repository.findProcessByNumber('123');

      expect(processFindUnique).toHaveBeenCalledWith({
        where: { number: '123' },
        select: {
          number: true,
          className: true,
          hasTransitado: true,
          tribunal: { select: { sigla: true } },
        },
      });
      expect(communicationFindMany).toHaveBeenCalledWith({
        where: { process: { number: '123' } },
        select: {
          id: true,
          publicationDate: true,
          type: true,
          content: true,
          aiSummary: true,
          recipients: {
            select: { name: true, type: true, role: true },
          },
        },
        orderBy: { publicationDate: 'desc' },
      });
      expect(recipientFindMany).toHaveBeenCalledWith({
        where: { communication: { process: { number: '123' } } },
        select: { name: true },
        distinct: ['name'],
        orderBy: { name: 'asc' },
      });
      expect(result).toEqual({
        process: {
          number: '123',
          className: 'Cumprimento de sentença',
          tribunal: { sigla: 'TJSP' },
          hasTransitado: true,
          communicationsCount: 2,
        },
        recipients: ['Maria', 'João'],
        communications: [
          {
            id: 'comm-2',
            publicationDate: '2026-04-14T12:00:00.000Z',
            type: 'DECISAO',
            content: 'Conteúdo 2',
            aiSummary: 'Resumo 2',
            recipients: [{ name: 'Maria', type: 'PARTY', role: 'AUTORA' }],
          },
          {
            id: 'comm-1',
            publicationDate: '2026-04-13T12:00:00.000Z',
            type: 'DESPACHO',
            content: 'Conteúdo 1',
            aiSummary: null,
            recipients: [{ name: 'João', type: 'LAWYER', role: null }],
          },
        ],
      });
    });
  });
});
