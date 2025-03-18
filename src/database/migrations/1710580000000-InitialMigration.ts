import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1710580000000 implements MigrationInterface {
  name = 'InitialMigration1710580000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Games table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "game" (
        "id" SERIAL PRIMARY KEY,
        "name" character varying NOT NULL,
        "rules" character varying
      )
    `);

    // Sessions table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "session" (
        "id" SERIAL PRIMARY KEY,
        "isActive" boolean NOT NULL DEFAULT true,
        "gameId" integer,
        CONSTRAINT "FK_session_game" FOREIGN KEY ("gameId") REFERENCES "game" ("id")
      )
    `);

    // Teams table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "team" (
        "id" SERIAL PRIMARY KEY,
        "name" character varying NOT NULL,
        "sessionId" integer,
        CONSTRAINT "FK_team_session" FOREIGN KEY ("sessionId") REFERENCES "session" ("id") ON DELETE CASCADE
      )
    `);

    // Players table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "player" (
        "id" SERIAL PRIMARY KEY,
        "name" character varying NOT NULL,
        "sessionId" integer,
        "teamId" integer,
        CONSTRAINT "FK_player_session" FOREIGN KEY ("sessionId") REFERENCES "session" ("id"),
        CONSTRAINT "FK_player_team" FOREIGN KEY ("teamId") REFERENCES "team" ("id") ON DELETE CASCADE
      )
    `);

    // Scores table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "score" (
        "id" SERIAL PRIMARY KEY,
        "points" integer NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "playerId" integer,
        "teamId" integer,
        "sessionId" integer,
        CONSTRAINT "FK_score_player" FOREIGN KEY ("playerId") REFERENCES "player" ("id") ON DELETE CASCADE,
        CONSTRAINT "FK_score_team" FOREIGN KEY ("teamId") REFERENCES "team" ("id") ON DELETE CASCADE,
        CONSTRAINT "FK_score_session" FOREIGN KEY ("sessionId") REFERENCES "session" ("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "score"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "player"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "team"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "session"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "game"`);
  }
}
