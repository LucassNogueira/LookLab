CREATE TYPE "public"."category" AS ENUM('top', 'bottom', 'shoes', 'accessory', 'outerwear');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TYPE "public"."sub_category_enum" AS ENUM('t-shirt', 'shirt', 'blouse', 'sweater', 'hoodie', 'tank top', 'bodysuit', 'corset', 'vest', 'polo', 'turtleneck', 'crop top', 'sweatshirt', 'camisole', 'tube top', 'jeans', 'pants', 'shorts', 'skirt', 'leggings', 'sweatpants', 'trousers', 'joggers', 'cargo pants', 'maxi skirt', 'mini skirt', 'chinos', 'culottes', 'sneakers', 'boots', 'heels', 'sandals', 'flats', 'loafers', 'slippers', 'oxfords', 'wedges', 'running shoes', 'platforms', 'hat', 'scarf', 'gloves', 'belt', 'bag', 'jewelry', 'sunglasses', 'tie', 'beanie', 'cap', 'watch', 'earrings', 'necklace', 'bracelet', 'jacket', 'coat', 'blazer', 'cardigan', 'raincoat', 'parka', 'trench coat', 'puffer jacket', 'denim jacket', 'leather jacket', 'bomber jacket', 'windbreaker');--> statement-breakpoint
CREATE TYPE "public"."subscription_tier" AS ENUM('free', 'basic', 'pro');--> statement-breakpoint
CREATE TABLE "body_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"image_url" text NOT NULL,
	"name" text DEFAULT 'My Profile',
	"is_default" text DEFAULT 'false',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clothing_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"image_url" text NOT NULL,
	"category" "category" NOT NULL,
	"sub_category" "sub_category_enum",
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "outfits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"occasion" text NOT NULL,
	"generated_image_url" text NOT NULL,
	"items_used" uuid[],
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usage_tracking" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"month" text NOT NULL,
	"generations_used" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"email" text NOT NULL,
	"role" "role" DEFAULT 'user' NOT NULL,
	"subscription_tier" "subscription_tier" DEFAULT 'free' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_clerk_user_id_unique" UNIQUE("clerk_user_id")
);
--> statement-breakpoint
ALTER TABLE "usage_tracking" ADD CONSTRAINT "usage_tracking_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "body_profiles_user_id_idx" ON "body_profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "clothing_items_user_id_idx" ON "clothing_items" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "outfits_user_id_idx" ON "outfits" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "usage_tracking_user_id_idx" ON "usage_tracking" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "usage_tracking_month_idx" ON "usage_tracking" USING btree ("month");--> statement-breakpoint
CREATE INDEX "users_clerk_user_id_idx" ON "users" USING btree ("clerk_user_id");