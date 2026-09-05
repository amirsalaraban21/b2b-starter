# EarMed Store

EarMed Store is a Persian-first, bilingual commerce application for hearing-care products and professional purchasing. It combines a Medusa v2 backend with a Next.js storefront and supports retail checkout, customer accounts, professional applications, quotes, and server-authoritative manual-payment review.

The catalog may contain demonstration data. Review products, prices, legal copy, contact details, payment instructions, and shipping configuration before production use.

## Stack

- Medusa v2 backend and Admin
- Next.js 15 storefront
- PostgreSQL
- pnpm workspaces and Turborepo

## Local development

Prerequisites: Node.js 20.19+ (or 22.12+), pnpm, and PostgreSQL.

```powershell
pnpm.cmd install
Copy-Item apps/backend/.env.template apps/backend/.env
Copy-Item apps/storefront/.env.template apps/storefront/.env.local
pnpm.cmd --filter @b2b-starter/backend exec medusa db:migrate
pnpm.cmd run dev
```

The backend and Admin run at `http://localhost:9000`; the storefront runs at `http://localhost:8000`. Create an Admin user with a unique local-development password:

```powershell
pnpm.cmd --filter @b2b-starter/backend exec medusa user -e <admin-email> -p <unique-password>
```

Configure the Iran region, IRR prices, sales channel, publishable API key, and shipping options in Medusa Admin. Then set the documented storefront public variables in `apps/storefront/.env.local`. Never commit real secrets or bank details.

## Manual payment

Manual-payment instructions come from backend environment variables documented in `apps/backend/.env.template`. Customers can submit a receipt, but only authenticated Admin operations can approve or reject it. Creating an order does not prove payment; production fulfillment must follow the authoritative manual-payment review status.

Receipt storage depends on the configured Medusa File Module provider. Use durable private object storage in production and define operational policies for review, retention, access, refunds, and reconciliation.

## Production dependencies

Before launch, provide and verify:

- production PostgreSQL, Redis, and durable file storage
- strong JWT, cookie, and revalidation secrets
- production domains, CORS settings, TLS, backups, monitoring, and logging
- final company identity, legal pages, support contacts, shipping rules, and tax policy
- real Iran region/sales-channel configuration and complete IRR catalog prices
- reviewed manual-payment account details and an internal approval/fulfillment procedure

Run validation before deployment:

```powershell
pnpm.cmd --filter @b2b-starter/storefront exec tsc --noEmit
pnpm.cmd --filter @b2b-starter/storefront run build
pnpm.cmd --filter @b2b-starter/backend exec tsc --noEmit
```

## Safe starter-data cleanup

`apps/backend/src/scripts/cleanup-starter-demo.ts` targets only the exact original electronics products from the upstream seed. It is a dry run unless the explicit confirmation flag is supplied. Review its candidate log before confirming; it does not remove customers, orders, regions, or EarMed-tagged catalog records.

## License

Licensed under the [MIT License](./LICENSE).
