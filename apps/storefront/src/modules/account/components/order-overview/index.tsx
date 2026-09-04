"use client"

import { ManualPayment } from "@/lib/data/manual-payment"
import { Locale } from "@/lib/i18n"
import OrderCard from "@/modules/account/components/order-card"
import Button from "@/modules/common/components/button"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

const OrderOverview = ({
  orders,
  payments,
  locale,
}: {
  orders: HttpTypes.StoreOrder[]
  payments: (ManualPayment | null)[]
  locale: Locale
}) => {
  if (orders.length)
    return (
      <div className="flex w-full flex-col gap-y-3">
        {orders.map((order, index) => (
          <OrderCard
            key={order.id}
            order={order}
            manualPayment={payments[index] || null}
            locale={locale}
          />
        ))}
      </div>
    )
  return (
    <div
      className="flex w-full flex-col items-center gap-y-4 rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900"
      data-testid="no-orders-container"
    >
      <h2 className="text-large-semi">
        {locale === "fa" ? "هنوز سفارشی ثبت نشده است" : "No orders yet"}
      </h2>
      <p className="text-base-regular">
        {locale === "fa"
          ? "پس از ثبت سفارش، وضعیت آن را اینجا خواهید دید."
          : "Your orders and their payment status will appear here."}
      </p>
      <LocalizedClientLink href="/">
        <Button data-testid="continue-shopping-button">
          {locale === "fa" ? "ادامه خرید" : "Continue shopping"}
        </Button>
      </LocalizedClientLink>
    </div>
  )
}
export default OrderOverview
