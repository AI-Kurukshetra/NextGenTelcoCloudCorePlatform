#!/usr/bin/env bash
#
# NGCMCP Cron Live Data Script
# Run this via cron to continuously inject live data into the dashboard.
# Dashboard will appear dynamic with KPIs, alarms, sessions, and metrics updating.
#
# Setup:
#   chmod +x scripts/cron-live-data.sh
#   crontab -e
#   Add: */1 * * * * cd /path/to/Product && ./scripts/cron-live-data.sh >> /tmp/ngcmcp-cron.log 2>&1
#
# Or use npm: npm run db:simulate:cron
#
set -e

cd "$(dirname "$0")/.."
SCRIPT_DIR="$(pwd)"

# Load .env if present
if [ -f .env ]; then
  set -a
  . .env
  set +a
fi

echo "[$(date -Iseconds)] Running live data tick..."
npx tsx scripts/simulate-live-data.ts --once
echo "[$(date -Iseconds)] Done."
