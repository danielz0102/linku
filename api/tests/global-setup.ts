import { Pool } from "pg"

import { DB_URL } from "#env.ts"

export default async () => {
  const pool = new Pool({ connectionString: DB_URL })

  await pool.query(`
    DO $$
    DECLARE r RECORD;
    BEGIN
      FOR r IN (
        SELECT schema_name
        FROM information_schema.schemata
        WHERE schema_name LIKE 'test_%'
      ) LOOP
        EXECUTE 'DROP SCHEMA IF EXISTS "' || r.schema_name || '" CASCADE';
      END LOOP;
    END $$;
  `)

  await pool.end()
}
