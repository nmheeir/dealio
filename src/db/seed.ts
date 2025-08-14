import {
  revalidateItems,
  seedCategories,
  seedSubcategories,
} from '@/libs/actions/seed';
import { logger } from '@/libs/Logger';

async function runSeed() {
  logger.info('⏳ Running seed...');

  const start = Date.now();

  await seedCategories();

  await seedSubcategories();

  // Add more seed functions here

  await revalidateItems();

  const end = Date.now();

  logger.info(`✅ Seed completed in ${end - start}ms`);

  process.exit(0);
}

runSeed().catch((err) => {
  logger.error('❌ Seed failed');
  logger.error(err);
  process.exit(1);
});
