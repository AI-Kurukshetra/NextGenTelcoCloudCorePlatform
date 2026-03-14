#!/usr/bin/env npx tsx
/**
 * Run database migrations via Node (pg) - works when psql has network restrictions
 * Run: npm run db:migrate
 */
import "dotenv/config";
import * as dns from "node:dns";
import { Client } from "pg";
import * as fs from "fs";
import * as path from "path";

// URL priority: DIRECT (bypasses pooler) > pooler > standard. We try each until one connects.
function getDbUrls(): string[] {
  const urls: string[] = [];
  if (process.env.DIRECT_DATABASE_URL) urls.push(process.env.DIRECT_DATABASE_URL);
  if (process.env.DATABASE_URL_POOLER) urls.push(process.env.DATABASE_URL_POOLER);
  if (process.env.DATABASE_URL) urls.push(process.env.DATABASE_URL);
  return [...new Set(urls)]; // dedupe
}

const migrationsDir = path.join(process.cwd(), "supabase", "migrations");
const seedPath = path.join(process.cwd(), "supabase", "seed.sql");

function getMigrationFiles(): string[] {
  if (!fs.existsSync(migrationsDir)) return [];
  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith(".sql"));
  return files.sort();
}

function getConnectionConfig(url: string): Promise<{ connectionString: string }> {
  const parsed = new URL(url);
  const host = parsed.hostname;

  // Pooler host (*.pooler.supabase.com) has IPv4; use directly
  if (host.includes("pooler.supabase.com")) {
    return Promise.resolve({ connectionString: url });
  }

  // Direct db.*.supabase.co is often IPv6-only; force IPv4 if A records exist
  return dns.promises.resolve4(host).then(
    (addrs) => {
      if (addrs.length === 0) throw new Error(`No IPv4 address for ${host}`);
      parsed.hostname = addrs[0];
      return { connectionString: parsed.toString() };
    },
    (err: NodeJS.ErrnoException) => {
      if (err.code === "ENODATA" || err.code === "ENOTFOUND") {
        throw new Error(
          `Host ${host} has no IPv4 records (IPv6-only). Use the Connection Pooler URL instead:\n` +
          `  1. Supabase Dashboard → Settings → Database\n` +
          `  2. Connection string → "Transaction" (port 6543)\n` +
          `  3. Set DATABASE_URL or DATABASE_URL_POOLER to that URI in .env`
        );
      }
      throw err;
    }
  );
}

async function run() {
  const urls = getDbUrls();
  if (urls.length === 0) {
    console.error("❌ Missing DATABASE_URL in .env");
    process.exit(1);
  }

  let client: Client | null = null;
  const lastErrors: string[] = [];

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const parsed = new URL(url);
    const label = parsed.hostname.includes("pooler.") ? "pooler" : "direct";

    try {
      const config = await getConnectionConfig(url);
      client = new Client(config);
      console.log(`🔌 Connecting to database (${label})...\n`);
      await client.connect();
      await client.query("SET statement_timeout = 0");
      console.log("✅ Connected.\n");
      break;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      lastErrors.push(`  [${label}] ${msg.slice(0, 80)}${msg.length > 80 ? "…" : ""}`);
      if (
        msg.includes("Tenant or user not found") ||
        msg.includes("no IPv4 records") ||
        msg.includes("ENETUNREACH") ||
        msg.includes("ECONNRESET") ||
        msg.includes("Connection terminated")
      ) {
        continue; // try next URL
      }
      console.error("❌ Migration failed:", e);
      process.exit(1);
    }
  }

  if (!client) {
    console.error("❌ Could not connect with any configured URL.\n");
    lastErrors.forEach((e) => console.error(e));
    console.error("\n  Fix: Supabase Dashboard → Settings → Database → copy exact URI.");
    console.error("  Try port 6543 (Transaction) if 5432 fails.");
    process.exit(1);
  }

  try {
    const migrationFiles = getMigrationFiles();
    if (migrationFiles.length === 0) {
      console.warn("⚠️ No migration files found in supabase/migrations");
    }
    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      if (!fs.existsSync(filePath)) {
        console.error(`❌ Migration file not found: ${filePath}`);
        process.exit(1);
      }
      const sql = fs.readFileSync(filePath, "utf8");
      console.log(`📄 Running ${file}...`);
      await client.query(sql);
      console.log(`   ✓ Done.\n`);
    }

    if (fs.existsSync(seedPath)) {
      console.log("📄 Running seed.sql...");
      const seedSql = fs.readFileSync(seedPath, "utf8");
      await client.query(seedSql);
      console.log("   ✓ Done.\n");
    }

    const fakeSeedPath = path.join(process.cwd(), "supabase", "seed_fake_100.sql");
    if (fs.existsSync(fakeSeedPath)) {
      console.log("📄 Running seed_fake_100.sql (100 records per component)...");
      const fakeSeedSql = fs.readFileSync(fakeSeedPath, "utf8");
      await client.query(fakeSeedSql);
      console.log("   ✓ Done.\n");
    }

    console.log("✅ All migrations and seed completed successfully.");
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("Tenant or user not found")) {
      console.error("❌ Migration failed: Supabase pooler cannot identify your project.\n");
      console.error("   Fix: Use the DIRECT connection URL (bypasses pooler):\n");
      console.error("   1. Supabase Dashboard → Settings → Database\n");
      console.error("   2. Connection string → \"URI\" (direct, port 5432)\n");
      console.error("   3. Add to .env: DIRECT_DATABASE_URL=\"postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres\"\n");
      process.exit(1);
    }
    console.error("❌ Migration failed:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
