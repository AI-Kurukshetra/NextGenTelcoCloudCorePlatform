-- ============================================================
-- Legacy compatibility migration.
-- NOTE: all missing-table DDL was consolidated in:
--   202603140004_gap_completion_core.sql
-- This file exists so external checklists that reference the
-- original filename remain consistent with this repository.
-- ============================================================

DO $$
BEGIN
  RAISE NOTICE 'Compatibility migration: schema objects already created by 202603140004_gap_completion_core.sql';
END;
$$;
