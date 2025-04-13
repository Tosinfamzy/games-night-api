import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixSessionGamesPrimaryKey1744486616248
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // First, create a temporary table with the unique combinations
    await queryRunner.query(`
            CREATE TABLE "session_games_temp" AS
            SELECT DISTINCT "sessionId", "gameId"
            FROM "session_games"
        `);

    // Drop constraints from the original table
    await queryRunner.query(`
            ALTER TABLE "session_games" 
            DROP CONSTRAINT IF EXISTS "PK_d783522e21da7689f57ee4f2274"
        `);

    await queryRunner.query(`
            ALTER TABLE "session_games" 
            DROP CONSTRAINT IF EXISTS "FK_session_games_session"
        `);

    await queryRunner.query(`
            ALTER TABLE "session_games" 
            DROP CONSTRAINT IF EXISTS "FK_session_games_game"
        `);

    // Clear the original table
    await queryRunner.query(`
            TRUNCATE TABLE "session_games"
        `);

    // Insert unique records back
    await queryRunner.query(`
            INSERT INTO "session_games" ("sessionId", "gameId")
            SELECT "sessionId", "gameId"
            FROM "session_games_temp"
        `);

    // Add the composite primary key
    await queryRunner.query(`
            ALTER TABLE "session_games" 
            ADD CONSTRAINT "PK_session_games" 
            PRIMARY KEY ("sessionId", "gameId")
        `);

    // Re-add foreign key constraints
    await queryRunner.query(`
            ALTER TABLE "session_games" 
            ADD CONSTRAINT "FK_session_games_session"
            FOREIGN KEY ("sessionId") 
            REFERENCES "sessions"("id") 
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);

    await queryRunner.query(`
            ALTER TABLE "session_games" 
            ADD CONSTRAINT "FK_session_games_game"
            FOREIGN KEY ("gameId") 
            REFERENCES "game"("id") 
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);

    // Create indexes for better performance
    await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "IDX_session_games_sessionId" 
            ON "session_games" ("sessionId")
        `);

    await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "IDX_session_games_gameId" 
            ON "session_games" ("gameId")
        `);

    // Drop the temporary table
    await queryRunner.query(`
            DROP TABLE "session_games_temp"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`
            DROP INDEX IF EXISTS "IDX_session_games_gameId"
        `);

    await queryRunner.query(`
            DROP INDEX IF EXISTS "IDX_session_games_sessionId"
        `);

    // Drop constraints
    await queryRunner.query(`
            ALTER TABLE "session_games" 
            DROP CONSTRAINT IF EXISTS "PK_session_games"
        `);

    await queryRunner.query(`
            ALTER TABLE "session_games" 
            DROP CONSTRAINT IF EXISTS "FK_session_games_session"
        `);

    await queryRunner.query(`
            ALTER TABLE "session_games" 
            DROP CONSTRAINT IF EXISTS "FK_session_games_game"
        `);

    // Re-add original single-column primary key
    await queryRunner.query(`
            ALTER TABLE "session_games" 
            ADD CONSTRAINT "PK_d783522e21da7689f57ee4f2274" 
            PRIMARY KEY ("gameId")
        `);

    // Re-add foreign key constraints
    await queryRunner.query(`
            ALTER TABLE "session_games" 
            ADD CONSTRAINT "FK_session_games_session"
            FOREIGN KEY ("sessionId") 
            REFERENCES "sessions"("id") 
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);

    await queryRunner.query(`
            ALTER TABLE "session_games" 
            ADD CONSTRAINT "FK_session_games_game"
            FOREIGN KEY ("gameId") 
            REFERENCES "game"("id") 
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }
}
