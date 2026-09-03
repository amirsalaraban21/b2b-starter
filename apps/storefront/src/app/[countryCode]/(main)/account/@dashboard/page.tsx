import { Metadata } from "next"

import { retrieveCustomer } from "@/lib/data/customer"
import { listOrders } from "@/lib/data/orders"
import Overview from "@/modules/account/components/overview"
import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import { getLocale } from "@/lib/i18n"

export const metadata: Metadata = {
  title: "Account",
  description: "Overview of your account activity.",
}

export default async function OverviewTemplate() {
  const customer = await retrieveCustomer().catch(() => null)
  const orders = await listOrders().catch(() => null)
  const locale = getLocale((await cookies()).get("earmed-locale")?.value)

  if (!customer) {
    notFound()
  }

  return <Overview customer={customer} orders={orders} locale={locale} />
}
