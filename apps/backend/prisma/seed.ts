import { PrismaClient } from '@prisma/client';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { SyncService } from '../src/modules/sync/sync.service';

const prisma = new PrismaClient();
const SEED_COMPLETE_STATUS = 'SEED_COMPLETE';

async function main() {
  const { endDate, seedKey, startDate } = getSeedDateRange();

  if (await hasCompletedSeed(seedKey)) {
    console.log(`Seed skipped: ${seedKey} already completed.`);
    return;
  }

  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const syncService = app.get(SyncService);

    console.log(
      `Seeding communications from ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}...`,
    );

    await syncService.syncDateRange(startDate, endDate);
    await markSeedAsCompleted(seedKey);

    console.log('Seed complete!');
  } finally {
    await app.close();
  }
}

async function hasCompletedSeed(seedKey: string) {
  const completedSeed = await prisma.syncLog.findFirst({
    where: {
      errorMessage: seedKey,
      status: SEED_COMPLETE_STATUS,
    },
  });

  return completedSeed !== null;
}

async function markSeedAsCompleted(seedKey: string) {
  await prisma.syncLog.create({
    data: {
      errorMessage: seedKey,
      finishedAt: new Date(),
      status: SEED_COMPLETE_STATUS,
    },
  });
}

function getSeedDateRange() {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() - 1);

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 20);

  const startIso = startDate.toISOString().split('T')[0];
  const endIso = endDate.toISOString().split('T')[0];

  return {
    endDate,
    seedKey: `communications:${startIso}:${endIso}`,
    startDate,
  };
}

main().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
