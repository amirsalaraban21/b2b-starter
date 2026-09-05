import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260905210000 extends Migration {
  async up(): Promise<void> {
    this.addSql(`create table if not exists "storefront_content" (
      "id" text not null,
      "key" text check ("key" in ('home', 'about', 'contact', 'faq')) not null,
      "locale" text check ("locale" in ('fa', 'en')) not null,
      "content" jsonb not null,
      "is_published" boolean not null default false,
      "created_at" timestamptz not null default now(),
      "updated_at" timestamptz not null default now(),
      "deleted_at" timestamptz null,
      constraint "storefront_content_pkey" primary key ("id")
    );`)
    this.addSql('create unique index if not exists "IDX_storefront_content_key_locale_unique" on "storefront_content" ("key", "locale") where "deleted_at" is null;')
    this.addSql('create index if not exists "IDX_storefront_content_published" on "storefront_content" ("is_published") where "deleted_at" is null;')
    this.addSql('create index if not exists "IDX_storefront_content_deleted_at" on "storefront_content" ("deleted_at") where "deleted_at" is not null;')
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "storefront_content" cascade;')
  }
}
