import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { GamesService } from '../games/games.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const gamesService = app.get(GamesService);
    console.log('Starting seed process...');

    // Initialize default games and rules
    await gamesService.initializeDefaultGamesAndRules();
    console.log('Default games and rules seeded successfully!');
  } catch (error) {
    console.error('Error during seed process:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
