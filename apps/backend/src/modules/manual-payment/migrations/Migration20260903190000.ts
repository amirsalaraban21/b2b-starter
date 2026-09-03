import { Migration } from "@medusajs/framework/mikro-orm/migrations"
export class Migration20260903190000 extends Migration {
  async up(): Promise<void> {
    this.addSql('create table if not exists "manual_payment" ("id" text not null, "order_id" text not null, "customer_id" text not null, "cart_id" text null, "amount" numeric not null, "raw_amount" jsonb not null, "currency_code" text not null, "status" text check ("status" in (\'awaiting_payment\', \'receipt_submitted\', \'under_review\', \'approved\', \'rejected\')) not null default \'awaiting_payment\', "receipt_file_id" text null, "receipt_url" text null, "receipt_mime_type" text null, "payer_name" text null, "payment_reference" text null, "admin_notes" text null, "reviewed_by" text null, "reviewed_at" timestamptz null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "manual_payment_pkey" primary key ("id"));')
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_manual_payment_order" ON "manual_payment" (order_id) WHERE deleted_at IS NULL;')
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_manual_payment_customer" ON "manual_payment" (customer_id) WHERE deleted_at IS NULL;')
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_manual_payment_status" ON "manual_payment" (status) WHERE deleted_at IS NULL;')
  }
  async down(): Promise<void> { this.addSql('drop table if exists "manual_payment" cascade;') }
}
