CREATE TYPE "public"."listingStatusEnum" AS ENUM('active', 'sold', 'expired');--> statement-breakpoint
CREATE TYPE "public"."logisticsStatusEnum" AS ENUM('scheduled', 'in_progress', 'completed');--> statement-breakpoint
CREATE TYPE "public"."marketDemandLevelEnum" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."orderStatusEnum" AS ENUM('pending', 'confirmed', 'in_transit', 'delivered', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."paymentSettlementStatusEnum" AS ENUM('pending', 'processed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."paymentStatusEnum" AS ENUM('pending', 'paid', 'failed');--> statement-breakpoint
CREATE TYPE "public"."roleEnum" AS ENUM('farmer', 'buyer', 'admin');--> statement-breakpoint
CREATE TYPE "public"."transactionStatusEnum" AS ENUM('pending', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "buyers" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"company_name" text,
	"business_type" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "farmers" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"location" text NOT NULL,
	"farm_size" numeric,
	"primary_crops" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "knowledge_sharing" (
	"id" serial PRIMARY KEY NOT NULL,
	"author_id" integer,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"category" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "listings" (
	"id" serial PRIMARY KEY NOT NULL,
	"farmer_id" integer,
	"product_id" integer,
	"quantity" numeric NOT NULL,
	"price" numeric NOT NULL,
	"available_date" timestamp NOT NULL,
	"status" "listingStatusEnum" DEFAULT 'active',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "logistics" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer,
	"pickup_location" text NOT NULL,
	"delivery_location" text NOT NULL,
	"status" "logisticsStatusEnum" DEFAULT 'in_progress',
	"estimated_delivery_date" timestamp,
	"actual_delivery_date" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "market_trends" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer,
	"date" timestamp NOT NULL,
	"average_price" numeric NOT NULL,
	"demandLevel" "marketDemandLevelEnum" DEFAULT 'high'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mpesa_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"transaction_id" integer,
	"mpesa_receipt_number" text NOT NULL,
	"phone_number" varchar(20) NOT NULL,
	"mpesa_transaction_date" timestamp NOT NULL,
	"account_reference" text,
	"transaction_type" text NOT NULL,
	"transaction_description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"buyer_id" integer,
	"listing_id" integer,
	"quantity" numeric NOT NULL,
	"total_price" numeric NOT NULL,
	"orderStatus" "orderStatusEnum" DEFAULT 'pending',
	"paymentStatus" "paymentStatusEnum" DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payment_settlements" (
	"id" serial PRIMARY KEY NOT NULL,
	"farmer_id" integer,
	"order_id" integer,
	"amount" numeric NOT NULL,
	"status" "paymentSettlementStatusEnum" DEFAULT 'pending',
	"settlement_date" timestamp,
	"transaction_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"unit" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ratings" (
	"id" serial PRIMARY KEY NOT NULL,
	"rater_id" integer,
	"rated_id" integer,
	"order_id" integer,
	"rating" integer NOT NULL,
	"comment" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer,
	"amount" numeric NOT NULL,
	"currency" text DEFAULT 'KES' NOT NULL,
	"status" "transactionStatusEnum" DEFAULT 'pending',
	"provider_transaction_id" text,
	"provider_transaction_date" timestamp,
	"metadata" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone_number" varchar(20) NOT NULL,
	"password" text NOT NULL,
	"role" "roleEnum" DEFAULT 'farmer',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "buyers" ADD CONSTRAINT "buyers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "farmers" ADD CONSTRAINT "farmers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "knowledge_sharing" ADD CONSTRAINT "knowledge_sharing_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "listings" ADD CONSTRAINT "listings_farmer_id_farmers_id_fk" FOREIGN KEY ("farmer_id") REFERENCES "public"."farmers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "listings" ADD CONSTRAINT "listings_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "logistics" ADD CONSTRAINT "logistics_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "market_trends" ADD CONSTRAINT "market_trends_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mpesa_transactions" ADD CONSTRAINT "mpesa_transactions_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_buyer_id_buyers_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."buyers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payment_settlements" ADD CONSTRAINT "payment_settlements_farmer_id_farmers_id_fk" FOREIGN KEY ("farmer_id") REFERENCES "public"."farmers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payment_settlements" ADD CONSTRAINT "payment_settlements_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payment_settlements" ADD CONSTRAINT "payment_settlements_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ratings" ADD CONSTRAINT "ratings_rater_id_users_id_fk" FOREIGN KEY ("rater_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ratings" ADD CONSTRAINT "ratings_rated_id_users_id_fk" FOREIGN KEY ("rated_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ratings" ADD CONSTRAINT "ratings_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
