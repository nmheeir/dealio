import { migrate } from 'drizzle-orm/postgres-js/migrator';

import { logger } from '@/libs/Logger';
import { db } from '.';

export async function runMigrate() {
  logger.info('⏳ Running migrations...');

  const start = Date.now();

  await migrate(db, { migrationsFolder: 'drizzle' });

  const end = Date.now();

  logger.info(`✅ Migrations completed in ${end - start}ms`);

  process.exit(0);
}

runMigrate().catch((err) => {
  logger.error('❌ Migration failed');
  logger.error(err);
  process.exit(1);
});
