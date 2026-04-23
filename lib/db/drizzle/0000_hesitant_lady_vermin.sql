CREATE TABLE IF NOT EXISTS "activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"type" text NOT NULL,
	"location" text NOT NULL,
	"start_date" text NOT NULL,
	"end_date" text,
	"image_url" text NOT NULL,
	"status" text NOT NULL,
	"registration_url" text,
	"max_participants" integer,
	"current_participants" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "artisan_services" (
	"id" serial PRIMARY KEY NOT NULL,
	"artisan_id" integer NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"price" numeric(10, 2) NOT NULL,
	"duration" text,
	"max_participants" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "artisans" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"level" text NOT NULL,
	"heritage_item" text NOT NULL,
	"heritage_item_id" integer,
	"bio" text NOT NULL,
	"avatar_url" text NOT NULL,
	"years_of_practice" integer,
	"awards" json DEFAULT '[]'::json,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "heritage_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"name_en" text,
	"level" text NOT NULL,
	"category" text NOT NULL,
	"description" text NOT NULL,
	"short_desc" text NOT NULL,
	"image_url" text NOT NULL,
	"video_url" text,
	"origin" text,
	"year_listed" integer,
	"artisan_count" integer DEFAULT 0,
	"tags" json DEFAULT '[]'::json,
	"featured" boolean DEFAULT false,
	"xiao_theme" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"description" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"image_url" text NOT NULL,
	"artisan_name" text,
	"heritage_item" text,
	"stock" integer DEFAULT 0,
	"rating" numeric(3, 1) DEFAULT '5.0',
	"review_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "quiz_leaderboard" (
	"id" serial PRIMARY KEY NOT NULL,
	"nickname" text NOT NULL,
	"correct" integer NOT NULL,
	"time" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "quiz_questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"question" text NOT NULL,
	"options" json NOT NULL,
	"correct_answer" integer NOT NULL,
	"explanation" text NOT NULL,
	"difficulty" text NOT NULL,
	"category" text,
	"points" integer DEFAULT 10
);
