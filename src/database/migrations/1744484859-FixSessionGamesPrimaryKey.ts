import { MigrationInterface, QueryRunner } from "typeorm";

export class FixSessionGamesPrimaryKey1744484859 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop any existing primary key constraint
        await queryRunner.query(`
            ALTER TABLE "session_games" DROP CONSTRAINT IF EXISTS "PK_d783522e21da7689f57ee4f2274"
        `);

        // Drop any existing foreign key constraints
        await queryRunner.query(`
            ALTER TABLE "session_games" DROP CONSTRAINT IF EXISTS "FK_session_games_session"
        `);
        
        await queryRunner.query(`
            ALTER TABLE "session_games" DROP CONSTRAINT IF EXISTS "FK_session_games_game"
        `);

        // Add composite primary key
        await queryRunner.query(`
            ALTER TABLE "session_games" ADD CONSTRAINT "PK_session_games" PRIMARY KEY ("sessionId", "gameId")
        `);

        // Re-add foreign key constraints
        await queryRunner.query(`
            ALTER TABLE "session_games" ADD CONSTRAINT "FK_session_games_session"
            FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE "session_games" ADD CONSTRAINT "FK_session_games_game"
            FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the composite primary key and foreign keys
        await queryRunner.query(`
            ALTER TABLE "session_games" DROP CONSTRAINT IF EXISTS "PK_session_games"
        `);

        await queryRunner.query(`
            ALTER TABLE "session_games" DROP CONSTRAINT IF EXISTS "FK_session_games_session"
        `);

        await queryRunner.query(`
            ALTER TABLE "session_games" DROP CONSTRAINT IF EXISTS "FK_session_games_game"
        `);

        // Add back single-column primary key (though this isn't ideal)
        await queryRunner.query(`
            ALTER TABLE "session_games" ADD CONSTRAINT "PK_d783522e21da7689f57ee4f2274" PRIMARY KEY ("gameId")
        `);

        // Re-add foreign key constraints
        await queryRunner.query(`
            ALTER TABLE "session_games" ADD CONSTRAINT "FK_session_games_session"
            FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE "session_games" ADD CONSTRAINT "FK_session_games_game"
            FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE CASCADE
        `);
    }
}