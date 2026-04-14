import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@Injectable()
export class TribunalsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.tribunal.findMany({
      orderBy: { sigla: 'asc' },
    });
  }

  upsertMany(tribunals: { name: string; sigla: string }[]) {
    return this.prisma.$transaction(
      tribunals.map((t) =>
        this.prisma.tribunal.upsert({
          where: { sigla: t.sigla },
          create: { name: t.name, sigla: t.sigla },
          update: { name: t.name, syncedAt: new Date() },
        }),
      ),
    );
  }
}
