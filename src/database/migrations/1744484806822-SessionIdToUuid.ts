import { MigrationInterface, QueryRunner } from "typeorm";

export class SessionIdToUuid1744484806822 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // First, enable the uuid-ossp extension if not already enabled
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // Add a new UUID column to sessions table
        await queryRunner.query(`ALTER TABLE "sessions" ADD COLUMN "uuid_id" UUID DEFAULT uuid_generate_v4()`);

        // Create a temporary mapping table to store the old ID to new UUID relationship
        await queryRunner.query(`
            CREATE TABLE "session_id_mapping" (
                "old_id" integer NOT NULL,
                "new_id" UUID NOT NULL,
                PRIMARY KEY ("old_id")
            )
        `);

        // Copy mappings from sessions to the mapping table
        await queryRunner.query(`
            INSERT INTO "session_id_mapping" ("old_id", "new_id")
            SELECT "id", "uuid_id" FROM "sessions"
        `);

        // Update foreign keys in players table
        await queryRunner.query(`
            ALTER TABLE "player" ADD COLUMN "session_uuid" UUID
        `);

        await queryRunner.query(`
            UPDATE "player" p
            SET "session_uuid" = m."new_id"
            FROM "session_id_mapping" m
            WHERE p."sessionId" = m."old_id"
        `);

        // Update foreign keys in teams table
        await queryRunner.query(`
            ALTER TABLE "team" ADD COLUMN "session_uuid" UUID
        `);

        await queryRunner.query(`
            UPDATE "team" t
            SET "session_uuid" = m."new_id"
            FROM "session_id_mapping" m
            WHERE t."sessionId" = m."old_id"
        `);

        // Update session_games junction table
        await queryRunner.query(`
            ALTER TABLE "session_games" ADD COLUMN "session_uuid" UUID
        `);

        await queryRunner.query(`
            UPDATE "session_games" sg
            SET "session_uuid" = m."new_id"
            FROM "session_id_mapping" m
            WHERE sg."sessionId" = m."old_id"
        `);

        // Drop old foreign key constraints
        await queryRunner.query(`
            ALTER TABLE "player" DROP CONSTRAINT IF EXISTS "FK_player_session"
        `);

        await queryRunner.query(`
            ALTER TABLE "team" DROP CONSTRAINT IF EXISTS "FK_team_session"
        `);

        await queryRunner.query(`
            ALTER TABLE "session_games" DROP CONSTRAINT IF EXISTS "FK_session_games_session"
        `);

        // Drop old columns
        await queryRunner.query(`
            ALTER TABLE "player" DROP COLUMN "sessionId"
        `);

        await queryRunner.query(`
            ALTER TABLE "team" DROP COLUMN "sessionId"
        `);

        await queryRunner.query(`
            ALTER TABLE "session_games" DROP COLUMN "sessionId"
        `);

        // Rename new columns
        await queryRunner.query(`
            ALTER TABLE "player" RENAME COLUMN "session_uuid" TO "sessionId"
        `);

        await queryRunner.query(`
            ALTER TABLE "team" RENAME COLUMN "session_uuid" TO "sessionId"
        `);

        await queryRunner.query(`
            ALTER TABLE "session_games" RENAME COLUMN "session_uuid" TO "sessionId"
        `);

        // Drop primary key from sessions table
        await queryRunner.query(`
            ALTER TABLE "sessions" DROP CONSTRAINT IF EXISTS "sessions_pkey"
        `);

        // Store all the data from the sessions table
        await queryRunner.query(`
            CREATE TABLE "sessions_temp" AS SELECT * FROM "sessions"
        `);

        // Drop the sessions table
        await queryRunner.query(`
            DROP TABLE "sessions"
        `);

        // Recreate the sessions table with UUID as primary key
        await queryRunner.query(`
            CREATE TABLE "sessions" (
                "id" UUID PRIMARY KEY,
                "hostId" integer,
                "sessionName" character varying NOT NULL,
                "isActive" boolean DEFAULT true,
                "joinCode" character varying,
                "status" character varying NOT NULL,
                "currentGameId" integer,
                "startTime" TIMESTAMP,
                "endTime" TIMESTAMP,
                "winner" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);

        // Migrate data back
        await queryRunner.query(`
            INSERT INTO "sessions" (
                "id", "hostId", "sessionName", "isActive", "joinCode", "status",
                "currentGameId", "startTime", "endTime", "winner", "createdAt", "updatedAt"
            )
            SELECT 
                "uuid_id", "hostId", "sessionName", "isActive", "joinCode", "status",
                "currentGameId", "startTime", "endTime", "winner", "createdAt", "updatedAt"
            FROM "sessions_temp"
        `);

        // Drop the temporary table
        await queryRunner.query(`
            DROP TABLE "sessions_temp"
        `);

        // Add foreign key constraints
        await queryRunner.query(`
            ALTER TABLE "player" ADD CONSTRAINT "FK_player_session"
            FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE "team" ADD CONSTRAINT "FK_team_session"
            FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE "session_games" ADD CONSTRAINT "FK_session_games_session"
            FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE CASCADE
        `);

        // Drop the mapping table
        await queryRunner.query(`
            DROP TABLE "session_id_mapping"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // This migration is complex to undo, as we'd need to convert UUID back to integers
        // and ensure referential integrity. In a real-world scenario, you might want to:
        // 1. Create a backup before running the up migration
        // 2. Consider this a one-way migration
        // 3. If absolutely necessary, restore from backup
        
        await queryRunner.query(`
            ALTER TABLE "sessions" ALTER COLUMN "id" TYPE INTEGER USING (nextval('sessions_id_seq'))
        `);
    }
}
