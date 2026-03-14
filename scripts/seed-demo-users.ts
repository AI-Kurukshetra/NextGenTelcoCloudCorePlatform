#!/usr/bin/env npx tsx
/**
 * NGCMCP Demo Users Seed
 * Creates one auth user per role with known credentials for testing.
 *
 * Run: npm run db:seed-users
 *
 * Users created (all share password: DemoPass123):
 *   super_admin@demo.ngcmcp.com    - Super Admin
 *   tenant_admin@demo.ngcmcp.com    - Tenant Admin
 *   network_engineer@demo.ngcmcp.com - Network Engineer
 *   billing_manager@demo.ngcmcp.com - Billing Manager
 */

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TENANT_ID = process.env.NEXT_PUBLIC_DEMO_TENANT_ID ?? "11111111-0000-0000-0000-000000000001";

const DEMO_PASSWORD = "DemoPass123";

const DEMO_USERS = [
  { email: "super_admin@demo.ngcmcp.com", role: "super_admin" as const, fullName: "Super Admin Demo" },
  { email: "tenant_admin@demo.ngcmcp.com", role: "tenant_admin" as const, fullName: "Tenant Admin Demo" },
  { email: "network_engineer@demo.ngcmcp.com", role: "network_engineer" as const, fullName: "Network Engineer Demo" },
  { email: "billing_manager@demo.ngcmcp.com", role: "billing_manager" as const, fullName: "Billing Manager Demo" },
  { email: "readonly@demo.ngcmcp.com", role: "readonly_viewer" as const, fullName: "Read-only Viewer Demo" },
  { email: "api_service@demo.ngcmcp.com", role: "api_service" as const, fullName: "API Service Demo" },
];

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log("\n🔐 NGCMCP Demo Users Seed");
  console.log("   Tenant:", TENANT_ID);
  console.log("   Password for all:", DEMO_PASSWORD);
  console.log("");

  for (const { email, role, fullName } of DEMO_USERS) {
    const { data: existing } = await supabase.auth.admin.listUsers();
    const userExists = existing?.users?.some((u) => u.email === email);

    if (userExists) {
      console.log(`   ⏭️  ${email} (${role}) - already exists, skipping`);
      continue;
    }

    const { data: created, error } = await supabase.auth.admin.createUser({
      email,
      password: DEMO_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });

    if (error) {
      console.error(`   ❌ ${email}: ${error.message}`);
      continue;
    }

    if (!created.user) {
      console.error(`   ❌ ${email}: no user returned`);
      continue;
    }

    const { error: profileErr } = await supabase.from("user_profiles").upsert({
      id: created.user.id,
      tenant_id: TENANT_ID,
      full_name: fullName,
      role,
      is_active: true,
    });

    if (profileErr) {
      console.error(`   ❌ ${email} profile: ${profileErr.message}`);
      continue;
    }

    console.log(`   ✓ ${email} (${role}) - created`);
  }

  console.log("\n✅ Demo users seed complete.\n");
  console.log("Login credentials (password for all: DemoPass123):");
  console.log("┌─────────────────────────────────────┬─────────────────────┐");
  console.log("│ Email                                │ Role                │");
  console.log("├─────────────────────────────────────┼─────────────────────┤");
  DEMO_USERS.forEach(({ email, role }) => {
    console.log(`│ ${email.padEnd(35)} │ ${role.padEnd(19)} │`);
  });
  console.log("└─────────────────────────────────────┴─────────────────────┘\n");
}

main().catch((err) => {
  console.error("❌ Fatal:", err);
  process.exit(1);
});
