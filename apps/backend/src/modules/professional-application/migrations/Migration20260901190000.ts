import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260901190000 extends Migration {
  async up(): Promise<void> {
    this.addSql('create table if not exists "professional_application" ("id" text not null, "first_name" text not null, "last_name" text not null, "email" text not null, "phone" text not null, "professional_type" text check ("professional_type" in (\'doctor\', \'audiologist\', \'clinic\', \'medical_organization\', \'other\')) not null, "organization_name" text null, "professional_identifier" text null, "city" text not null, "notes" text null, "status" text check ("status" in (\'pending\', \'approved\', \'rejected\', \'needs_information\')) not null default \'pending\', "admin_notes" text null, "customer_feedback" text null, "customer_id" text null, "company_id" text null, "reviewed_by" text null, "reviewed_at" timestamptz null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "professional_application_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_professional_application_email" ON "professional_application" (email) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_professional_application_status" ON "professional_application" (status) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_professional_application_created_at" ON "professional_application" (created_at) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_professional_application_deleted_at" ON "professional_application" (deleted_at) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('DROP INDEX IF EXISTS "IDX_professional_application_email";');
    this.addSql('DROP INDEX IF EXISTS "IDX_professional_application_status";');
    this.addSql('DROP INDEX IF EXISTS "IDX_professional_application_created_at";');
    this.addSql('DROP INDEX IF EXISTS "IDX_professional_application_deleted_at";');
    this.addSql('drop table if exists "professional_application" cascade;');
  }
}
