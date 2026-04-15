import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../infrastructure/database/prisma.service';

const ITEMS_PER_PAGE = 8;

@Injectable()
export class CommunicationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findPaginated(params: {
    page: number;
    search?: string;
    tribunalId?: number;
    startDate?: string;
    endDate?: string;
  }) {
    const where: Prisma.CommunicationWhereInput = {};

    if (params.search) {
      where.process = {
        ...((where.process as Prisma.ProcessWhereInput) ?? {}),
        number: { contains: params.search, mode: 'insensitive' },
      };
    }

    if (params.tribunalId) {
      where.process = {
        ...((where.process as Prisma.ProcessWhereInput) ?? {}),
        tribunalId: params.tribunalId,
      };
    }

    if (params.startDate || params.endDate) {
      where.publicationDate = {};
      if (params.startDate) {
        where.publicationDate.gte = new Date(params.startDate);
      }
      if (params.endDate) {
        where.publicationDate.lte = new Date(`${params.endDate}T23:59:59.999Z`);
      }
    }

    const skip = (params.page - 1) * ITEMS_PER_PAGE;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.communication.findMany({
        where,
        include: {
          process: {
            include: { tribunal: { select: { sigla: true } } },
          },
          recipients: {
            select: { name: true, type: true },
          },
        },
        orderBy: { publicationDate: 'desc' },
        skip,
        take: ITEMS_PER_PAGE,
      }),
      this.prisma.communication.count({ where }),
    ]);

    return {
      items: items.map((item) => ({
        id: item.id,
        pjeId: item.pjeId,
        publicationDate: item.publicationDate.toISOString(),
        type: item.type,
        content: item.content,
        communicationNumber: item.communicationNumber,
        process: {
          number: item.process.number,
          className: item.process.className,
          tribunal: { sigla: item.process.tribunal.sigla },
        },
        recipients: item.recipients,
      })),
      meta: {
        page: params.page,
        limit: ITEMS_PER_PAGE,
        total,
        totalPages: Math.ceil(total / ITEMS_PER_PAGE),
      },
    };
  }

  async findProcessByNumber(number: string) {
    const process = await this.prisma.process.findUnique({
      where: { number },
      select: {
        number: true,
        className: true,
        hasTransitado: true,
        tribunal: { select: { sigla: true } },
      },
    });

    if (!process) return null;

    const [communications, recipients] = await Promise.all([
      this.prisma.communication.findMany({
        where: { process: { number } },
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
      }),
      this.prisma.recipient.findMany({
        where: { communication: { process: { number } } },
        select: { name: true },
        distinct: ['name'],
        orderBy: { name: 'asc' },
      }),
    ]);

    return {
      process: {
        number: process.number,
        className: process.className,
        tribunal: { sigla: process.tribunal.sigla },
        hasTransitado: process.hasTransitado,
        communicationsCount: communications.length,
      },
      recipients: recipients.map((recipient) => recipient.name),
      communications: communications.map((c) => ({
        id: c.id,
        publicationDate: c.publicationDate.toISOString(),
        type: c.type,
        content: c.content,
        aiSummary: c.aiSummary,
        recipients: c.recipients,
      })),
    };
  }

  findCommunicationById(id: string) {
    return this.prisma.communication.findUnique({
      where: { id },
      select: { id: true, content: true, aiSummary: true, aiSummaryGeneratedAt: true },
    });
  }

  saveSummary(id: string, summary: string) {
    return this.prisma.communication.update({
      where: { id },
      data: { aiSummary: summary, aiSummaryGeneratedAt: new Date() },
    });
  }

  upsertFromPje(data: {
    pjeId: number;
    processNumber: string;
    className: string | null;
    classCode: string | null;
    tribunalSigla: string;
    publicationDate: Date;
    type: string;
    content: string;
    organName: string | null;
    medium: string | null;
    link: string | null;
    documentType: string | null;
    communicationNumber: number | null;
    hash: string | null;
    active: boolean;
    recipients: { name: string; type: string; role: string | null; oabNumber: string | null; oabState: string | null }[];
  }) {
    return this.prisma.$transaction(async (tx) => {
      const tribunal = await tx.tribunal.upsert({
        where: { sigla: data.tribunalSigla },
        create: { name: data.tribunalSigla, sigla: data.tribunalSigla },
        update: { syncedAt: new Date() },
      });

      const process = await tx.process.upsert({
        where: { number: data.processNumber },
        create: {
          number: data.processNumber,
          className: data.className,
          classCode: data.classCode,
          tribunalId: tribunal.id,
        },
        update: {
          className: data.className ?? undefined,
          classCode: data.classCode ?? undefined,
        },
      });

      const communication = await tx.communication.upsert({
        where: { pjeId: data.pjeId },
        create: {
          pjeId: data.pjeId,
          processId: process.id,
          publicationDate: data.publicationDate,
          type: data.type,
          content: data.content,
          organName: data.organName,
          medium: data.medium,
          link: data.link,
          documentType: data.documentType,
          communicationNumber: data.communicationNumber,
          hash: data.hash,
          active: data.active,
        },
        update: {
          content: data.content,
          active: data.active,
        },
      });

      // Replace recipients
      await tx.recipient.deleteMany({ where: { communicationId: communication.id } });
      if (data.recipients.length > 0) {
        await tx.recipient.createMany({
          data: data.recipients.map((r) => ({
            communicationId: communication.id,
            name: r.name,
            type: r.type,
            role: r.role,
            oabNumber: r.oabNumber,
            oabState: r.oabState,
          })),
        });
      }

      // Update hasTransitado flag
      if (data.content.toLowerCase().includes('transitou em julgado')) {
        await tx.process.update({
          where: { id: process.id },
          data: { hasTransitado: true },
        });
      }

      return communication;
    });
  }

  createSyncLog(data: { status: string; recordsFetched: number; recordsSaved: number; errorMessage?: string; finishedAt?: Date }) {
    return this.prisma.syncLog.create({ data });
  }
}
