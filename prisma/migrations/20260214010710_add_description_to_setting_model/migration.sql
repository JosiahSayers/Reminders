-- AlterTable
ALTER TABLE "Setting" ADD COLUMN "description" TEXT;

UPDATE Setting
SET description = 'Unlocks AI generation of CRON strings when creating a new reminder'
WHERE name = 'AI Enabled';

UPDATE Setting
SET description = 'Prints a logo on reminders when enabled'
WHERE name = 'Print Logo';