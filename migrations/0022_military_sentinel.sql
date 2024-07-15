ALTER TABLE "submissions" DROP CONSTRAINT "submissions_class_id_classes_class_id_fk";
--> statement-breakpoint
ALTER TABLE "submissions" DROP COLUMN IF EXISTS "class_id";