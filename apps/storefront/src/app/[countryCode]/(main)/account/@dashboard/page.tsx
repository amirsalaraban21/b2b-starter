import { Metadata } from "next"

import { retrieveCustomer } from "@/lib/data/customer"
import { listOrders } from "@/lib/data/orders"
import { getManualPayment } from "@/lib/data/manual-payment"
import { getProfessionalApplication } from "@/lib/data/professional-application"
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
  const orders = await listOrders().catch(() => [])
  const [application, latestPayment] = await Promise.all([
    getProfessionalApplication().catch(() => null),
    orders[0] ? getManualPayment(orders[0].id).catch(() => null) : null,
  ])
  const locale = getLocale((await cookies()).get("earmed-locale")?.value)

  if (!customer) {
    notFound()
  }

  return (
    <Overview
      customer={customer}
      orders={orders}
      locale={locale}
      application={application}
      latestPayment={latestPayment}
    />
  )
}
