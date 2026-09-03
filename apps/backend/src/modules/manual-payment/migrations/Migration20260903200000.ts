import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260903200000 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table if exists "manual_payment" add column if not exists "raw_amount" jsonb null;')
    this.addSql('update "manual_payment" set "raw_amount" = jsonb_build_object(\'value\', "amount"::text, \'precision\', 20) where "raw_amount" is null;')
    this.addSql('alter table if exists "manual_payment" alter column "raw_amount" set not null;')
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "manual_payment" drop column if exists "raw_amount";')
  }
}
