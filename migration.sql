-- Migration: Remove unused fields from schema
-- Generated manually based on schema changes

-- Remove unused columns from user_profiles table
ALTER TABLE "user_profiles" DROP COLUMN IF EXISTS "avatar_url";
ALTER TABLE "user_profiles" DROP COLUMN IF EXISTS "preferences";

-- Remove unused columns from workshop_enrollments table
ALTER TABLE "workshop_enrollments" DROP COLUMN IF EXISTS "completion_date";
ALTER TABLE "workshop_enrollments" DROP COLUMN IF EXISTS "attendance_confirmed";
ALTER TABLE "workshop_enrollments" DROP COLUMN IF EXISTS "rating";
ALTER TABLE "workshop_enrollments" DROP COLUMN IF EXISTS "feedback";
ALTER TABLE "workshop_enrollments" DROP COLUMN IF EXISTS "certificate_issued";
ALTER TABLE "workshop_enrollments" DROP COLUMN IF EXISTS "notes";

-- Remove unused columns from announcements table
ALTER TABLE "announcements" DROP COLUMN IF EXISTS "views_count";