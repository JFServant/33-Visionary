CREATE TABLE "images" (
	"_id" serial PRIMARY KEY NOT NULL,
	"id" text NOT NULL,
	"original_name" text NOT NULL,
	"internal_name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"customer_id" text NOT NULL,
	CONSTRAINT "images_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "predictions" (
	"_id" serial PRIMARY KEY NOT NULL,
	"id" text NOT NULL,
	"x" text NOT NULL,
	"y" text NOT NULL,
	"width" text NOT NULL,
	"height" text NOT NULL,
	"classification" text NOT NULL,
	"confidence" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"image_id" text NOT NULL,
	CONSTRAINT "predictions_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "email" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "password" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "username" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_image_id_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE no action ON UPDATE no action;