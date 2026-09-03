import { retrieveOrder } from "@/lib/data/orders"
import { getManualPayment } from "@/lib/data/manual-payment"
import { getLocale } from "@/lib/i18n"
import OrderCompletedTemplate from "@/modules/order/templates/order-completed-template"
import { B2BOrder } from "@/types/global"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { cookies } from "next/headers"

type Props = {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "You purchase was successful",
}

export default async function OrderConfirmedPage(props: Props) {
  const params = await props.params
  const [order, payment] = (await Promise.all([
    retrieveOrder(params.id).catch(() => null),
    getManualPayment(params.id).catch(() => null),
  ])) as [B2BOrder | null, Awaited<ReturnType<typeof getManualPayment>> | null]

  if (!order || !payment) {
    return notFound()
  }

  const locale = getLocale((await cookies()).get("earmed-locale")?.value)
  return (
    <OrderCompletedTemplate order={order} payment={payment} locale={locale} />
  )
}
