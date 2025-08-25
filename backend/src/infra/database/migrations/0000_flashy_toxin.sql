CREATE TABLE "customers" (
	"_id" serial PRIMARY KEY NOT NULL,
	"id" varchar(10) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"username" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "customers_id_unique" UNIQUE("id"),
	CONSTRAINT "customers_email_unique" UNIQUE("email")
);
