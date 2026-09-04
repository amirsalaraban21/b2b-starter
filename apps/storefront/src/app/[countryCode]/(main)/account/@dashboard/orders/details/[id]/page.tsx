import { retrieveOrder } from "@/lib/data/orders"
import {
  getManualPayment,
  getManualPaymentConfig,
} from "@/lib/data/manual-payment"
import { getLocale } from "@/lib/i18n"
import { cookies } from "next/headers"
import OrderDetailsTemplate from "@/modules/order/templates/order-details-template"
import { Metadata } from "next"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const order = await retrieveOrder(params.id).catch(() => null)

  if (!order) {
    notFound()
  }

  return {
    title: `Order #${order.display_id}`,
    description: `View your order`,
  }
}

export default async function OrderDetailPage(props: Props) {
  const params = await props.params
  const order = await retrieveOrder(params.id).catch(() => null)

  if (!order) {
    notFound()
  }

  const locale = getLocale((await cookies()).get("earmed-locale")?.value)
  const [manualPayment, paymentConfig] = await Promise.all([
    getManualPayment(order.id).catch(() => null),
    getManualPaymentConfig(locale).catch(() => ({
      configured: false as const,
    })),
  ])
  return (
    <OrderDetailsTemplate
      order={order}
      locale={locale}
      manualPayment={manualPayment}
      paymentConfig={paymentConfig}
    />
  )
}
