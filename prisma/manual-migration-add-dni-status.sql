-- Migration: Add dni and status fields to Lead table
-- Date: 2026-01-12

-- Add dni column (nullable initially to avoid data loss)
ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "dni" TEXT;

-- Add status column with default value
ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'PENDIENTE';

-- Update existing records: set dni from email or a placeholder
UPDATE "Lead" SET "dni" = COALESCE(SUBSTRING("email" FROM 1 FOR 8), '00000000') WHERE "dni" IS NULL;

-- Now make dni NOT NULL (after filling data)
ALTER TABLE "Lead" ALTER COLUMN "dni" SET NOT NULL;

-- Verify the changes
-- SELECT id, name, dni, status FROM "Lead" LIMIT 5;