const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/app.module');
const { SyncService } = require('../dist/modules/sync/sync.service');

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const syncService = app.get(SyncService);

  // Seed with last 3 days, max 20 pages/day (100 items/day)
  // PJE API: 5 items/page for unfiltered queries, 20 req/min rate limit
  const endDate = new Date();
  endDate.setDate(endDate.getDate() - 1);

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 3);

  console.log(
    `Seeding communications from ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}...`,
  );

  await syncService.syncDateRange(startDate, endDate, 20);

  console.log('Seed complete!');
  await app.close();
}

main().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
