DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('teacher', 'student');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "announcements" (
	"announcement_id" serial PRIMARY KEY NOT NULL,
	"class_id" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"posted_by" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "assignments" (
	"assignment_id" text PRIMARY KEY NOT NULL,
	"class_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"due_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "class_members" (
	"class_member_id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"class_id" text NOT NULL,
	"role" "role",
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "classes" (
	"class_id" text PRIMARY KEY NOT NULL,
	"class_name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"teacher_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "email_verifications" (
	"email_verification_id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"code" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "folders" (
	"folder_id" text PRIMARY KEY NOT NULL,
	"folder_name" text NOT NULL,
	"class_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "learning_materials" (
	"material_id" text PRIMARY KEY NOT NULL,
	"class_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"file_path" text NOT NULL,
	"uploaded_by" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "material_folders" (
	"material_folder_id" serial PRIMARY KEY NOT NULL,
	"material_id" text,
	"folder_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notifications" (
	"notification_id" serial PRIMARY KEY NOT NULL,
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "oauth_accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"provider" text NOT NULL,
	"provider_user_id" text NOT NULL,
	"access_token" text NOT NULL,
	"refresh_token" text,
	"expires_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"session_id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "submissions" (
	"submission_id" text PRIMARY KEY NOT NULL,
	"assignment_id" text NOT NULL,
	"file_path" text NOT NULL,
	"student_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"grade" numeric,
	"feedback" text,
	"graded_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"user_id" text PRIMARY KEY NOT NULL,
	"username" text,
	"email" text,
	"password_hash" text,
	"role" "role",
	"profile_picture" text,
	"bio" text,
	"is_email_verified" boolean DEFAULT false,
	"on_boarding_complete" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "announcements" ADD CONSTRAINT "announcements_class_id_classes_class_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("class_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "announcements" ADD CONSTRAINT "announcements_posted_by_users_user_id_fk" FOREIGN KEY ("posted_by") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assignments" ADD CONSTRAINT "assignments_class_id_classes_class_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("class_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "class_members" ADD CONSTRAINT "class_members_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "class_members" ADD CONSTRAINT "class_members_class_id_classes_class_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("class_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "classes" ADD CONSTRAINT "classes_teacher_id_users_user_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_verifications" ADD CONSTRAINT "email_verifications_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "folders" ADD CONSTRAINT "folders_class_id_classes_class_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("class_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "learning_materials" ADD CONSTRAINT "learning_materials_class_id_classes_class_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("class_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "learning_materials" ADD CONSTRAINT "learning_materials_uploaded_by_users_user_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "material_folders" ADD CONSTRAINT "material_folders_material_id_learning_materials_material_id_fk" FOREIGN KEY ("material_id") REFERENCES "public"."learning_materials"("material_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "material_folders" ADD CONSTRAINT "material_folders_folder_id_folders_folder_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."folders"("folder_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "oauth_accounts" ADD CONSTRAINT "oauth_accounts_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submissions" ADD CONSTRAINT "submissions_assignment_id_assignments_assignment_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."assignments"("assignment_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submissions" ADD CONSTRAINT "submissions_student_id_users_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
