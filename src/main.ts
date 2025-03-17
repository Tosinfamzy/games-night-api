import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation globally
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Enable CORS
  app.enableCors();

  // Set up Swagger
  const config = new DocumentBuilder()
    .setTitle('Games Night API')
    .setDescription('API for managing game nights, players, teams, and scoring')
    .setVersion('1.0')
    .addTag('games', 'Operations related to game management')
    .addTag('sessions', 'Operations related to game sessions')
    .addTag('players', 'Operations related to player management')
    .addTag('teams', 'Operations related to team management')
    .addTag('scoring', 'Operations related to scoring and leaderboards')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
