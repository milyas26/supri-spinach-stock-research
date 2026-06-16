import { readFileSync } from "fs";
import { join } from "path";
import pg from "pg";

async function migrate() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const projectRef = new URL(supabaseUrl).hostname.split(".")[0];

  const { Pool } = pg;
  const pool = new Pool({
    host: `aws-0-ap-southeast-1.pooler.supabase.com`,
    port: 5432,
    database: "postgres",
    user: `postgres.${projectRef}`,
    password: serviceKey,
    ssl: { rejectUnauthorized: false },
  });

  const schemaPath = join(process.cwd(), "db", "schema.sql");
  const sql = readFileSync(schemaPath, "utf-8");

  console.log("Running migration...");
  const client = await pool.connect();
  try {
    await client.query(sql);
    console.log("Migration applied successfully.");
    const { rows: tables } = await client.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('users', 'bookmarks')`
    );
    console.log("Created tables:", tables.map((r: { table_name: string }) => r.table_name).join(", "));
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
