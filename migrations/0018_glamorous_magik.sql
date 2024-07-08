DROP TABLE "assignment_modules";--> statement-breakpoint
DROP TABLE "class_modules";--> statement-breakpoint
DROP TABLE "material_modules";--> statement-breakpoint
DROP TABLE "modules";--> statement-breakpoint
ALTER TABLE "announcements" RENAME COLUMN "posted_by_id" TO "author_id";--> statement-breakpoint
ALTER TABLE "assignments" RENAME COLUMN "posted_by_id" TO "author_id";--> statement-breakpoint
ALTER TABLE "learning_materials" RENAME COLUMN "posted_by_id" TO "author_id";--> statement-breakpoint
ALTER TABLE "submissions" RENAME COLUMN "class_modules_id" TO "class_id";--> statement-breakpoint
ALTER TABLE "announcements" DROP CONSTRAINT "announcements_posted_by_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "assignments" DROP CONSTRAINT "assignments_posted_by_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "learning_materials" DROP CONSTRAINT "learning_materials_posted_by_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "submissions" DROP CONSTRAINT "submissions_class_modules_id_class_modules_class_module_id_fk";
--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "class_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "assignments" ADD COLUMN "due_date" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "assignments" ADD COLUMN "class_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "assignments" ADD COLUMN "is_open" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "assignments" ADD COLUMN "published_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "learning_materials" ADD COLUMN "class_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "learning_materials" ADD COLUMN "published_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "announcements" ADD CONSTRAINT "announcements_author_id_users_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assignments" ADD CONSTRAINT "assignments_author_id_users_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assignments" ADD CONSTRAINT "assignments_class_id_classes_class_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("class_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "learning_materials" ADD CONSTRAINT "learning_materials_author_id_users_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "learning_materials" ADD CONSTRAINT "learning_materials_class_id_classes_class_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("class_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submissions" ADD CONSTRAINT "submissions_class_id_classes_class_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("class_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
