import { Module, Global } from '@nestjs/common';
import { InMemoryStoreService } from './in-memory-store.service';

/**
 * DataModule
 *
 * Global module that provides the InMemoryStoreService as a singleton
 * shared across all modules in the application.
 *
 * Making it global (@Global()) means other modules don't need to import it
 * to use InMemoryStoreService - they just inject it.
 */
@Global()
@Module({
  providers: [InMemoryStoreService],
  exports: [InMemoryStoreService],
})
export class DataModule {}
