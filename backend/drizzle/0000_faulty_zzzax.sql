CREATE TYPE "public"."category_type" AS ENUM('health', 'legal_aid', 'food_relief', 'livelihood', 'mental_health', 'education', 'housing', 'childen_and_family');--> statement-breakpoint
CREATE TYPE "public"."cost_type" AS ENUM('free', 'with_fee', 'depends');--> statement-breakpoint
CREATE TYPE "public"."status_type" AS ENUM('active', 'inactive', 'pending', 'rejected');--> statement-breakpoint
CREATE TABLE "resources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"organization" varchar(255),
	"category" "category_type" NOT NULL,
	"address" text NOT NULL,
	"barangay" varchar(100),
	"city" varchar(100) DEFAULT 'Silang' NOT NULL,
	"province" varchar(100) DEFAULT 'Cavite' NOT NULL,
	"phone" varchar(50),
	"hours" varchar(255),
	"website" varchar(255),
	"cost" "cost_type" DEFAULT 'free' NOT NULL,
	"description" text,
	"lat" numeric(10, 7),
	"lng" numeric(10, 7),
	"status" "status_type" DEFAULT 'active' NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"organization" varchar(255),
	"category" "category_type" NOT NULL,
	"address" text NOT NULL,
	"barangay" varchar(100),
	"phone" varchar(50),
	"hours" varchar(255),
	"cost" "cost_type" DEFAULT 'free' NOT NULL,
	"description" text,
	"submitter_name" varchar(255),
	"submitter_email" varchar(255),
	"status" "status_type" DEFAULT 'pending' NOT NULL,
	"reviewed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_resources_category" ON "resources" USING btree ("category");--> statement-breakpoint
CREATE INDEX "idx_resources_status" ON "resources" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_resources_city" ON "resources" USING btree ("city");--> statement-breakpoint
CREATE INDEX "idx_submissions_status" ON "submissions" USING btree ("status");