import { ManualPayment, ManualPaymentStatus } from "@/lib/data/manual-payment"
import { Locale } from "@/lib/i18n"
import { convertToLocale } from "@/lib/util/money"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

const paymentLabels: Record<Locale, Record<ManualPaymentStatus, string>> = {
  fa: {
    awaiting_payment: "در انتظار پرداخت",
    receipt_submitted: "رسید ارسال شد",
    under_review: "در حال بررسی",
    approved: "پرداخت تأیید شد",
    rejected: "رسید رد شد",
  },
  en: {
    awaiting_payment: "Awaiting payment",
    receipt_submitted: "Receipt submitted",
    under_review: "Under review",
    approved: "Payment approved",
    rejected: "Receipt rejected",
  },
}
const fulfillmentLabel = (status: string | undefined, locale: Locale) => {
  if (status === "shipped" || status === "delivered")
    return locale === "fa" ? "ارسال شده" : "Shipped"
  if (status === "fulfilled" || status === "partially_fulfilled")
    return locale === "fa" ? "در حال آماده‌سازی" : "Being prepared"
  return locale === "fa" ? "هنوز آماده‌سازی نشده" : "Not yet fulfilled"
}

const OrderCard = ({
  order,
  locale,
  manualPayment,
}: {
  order: HttpTypes.StoreOrder
  locale: Locale
  manualPayment: ManualPayment | null
}) => {
  const fa = locale === "fa"
  const quantity =
    order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
  const fulfillment = (
    order as HttpTypes.StoreOrder & { fulfillment_status?: string }
  ).fulfillment_status
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-black">
            {fa ? "سفارش" : "Order"} #
            {new Intl.NumberFormat(fa ? "fa-IR" : "en-US").format(
              order.display_id || 0
            )}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {new Date(order.created_at).toLocaleDateString(
              fa ? "fa-IR" : "en-US"
            )}
          </p>
        </div>
        <p className="text-lg font-black text-teal-700 dark:text-teal-300">
          {convertToLocale({
            amount: order.total,
            currency_code: order.currency_code,
            locale,
          })}
        </p>
      </div>
      <div className="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-3">
        <p>
          {fa ? "تعداد" : "Items"}:{" "}
          {new Intl.NumberFormat(fa ? "fa-IR" : "en-US").format(quantity)}
        </p>
        <p>
          {fa ? "ارسال" : "Fulfillment"}:{" "}
          {fulfillmentLabel(fulfillment, locale)}
        </p>
        <p>
          {fa ? "پرداخت دستی" : "Manual payment"}:{" "}
          {manualPayment
            ? paymentLabels[locale][manualPayment.status]
            : fa
            ? "ثبت نشده"
            : "Not available"}
        </p>
      </div>
      <LocalizedClientLink
        href={`/account/orders/details/${order.id}`}
        className="mt-4 inline-block text-sm font-bold text-teal-700 hover:underline dark:text-teal-300"
      >
        {fa ? "جزئیات سفارش" : "Order details"}
      </LocalizedClientLink>
    </article>
  )
}
export { fulfillmentLabel, paymentLabels }
export default OrderCard
