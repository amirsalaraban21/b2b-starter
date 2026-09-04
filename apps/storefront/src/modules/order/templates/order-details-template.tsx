import { ArrowUturnLeft } from "@medusajs/icons"
import React from "react"

import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import Button from "@/modules/common/components/button"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import Item from "@/modules/order/components/item"
import OrderDetails from "@/modules/order/components/order-details"
import OrderSummary from "@/modules/order/components/order-summary"
import ShippingDetails from "@/modules/order/components/shipping-details"
import BillingDetails from "@/modules/order/components/billing-details"
import ManualPaymentStatus from "@/modules/order/components/manual-payment-status"
import { ManualPayment, ManualPaymentConfig } from "@/lib/data/manual-payment"
import { Locale } from "@/lib/i18n"
import { fulfillmentLabel } from "@/modules/account/components/order-card"

type OrderDetailsTemplateProps = {
  order: HttpTypes.StoreOrder
  locale: Locale
  manualPayment: ManualPayment | null
  paymentConfig: ManualPaymentConfig
}

const OrderDetailsTemplate: React.FC<OrderDetailsTemplateProps> = ({
  order,
  locale,
  manualPayment,
  paymentConfig,
}) => {
  const fa = locale === "fa"
  const fulfillment = (
    order as HttpTypes.StoreOrder & {
      fulfillment_status?: string
      fulfillments?: Array<{
        labels?: Array<{ tracking_number?: string; tracking_url?: string }>
      }>
    }
  ).fulfillment_status
  const labels =
    (order as any).fulfillments?.flatMap((item: any) => item.labels || []) || []
  return (
    <div className="flex flex-col justify-center gap-y-2">
      <div className="flex gap-2 justify-between items-center mb-2">
        <LocalizedClientLink
          href="/account/orders"
          className="flex gap-2 items-center text-ui-fg-subtle hover:text-ui-fg-base"
          data-testid="back-to-overview-button"
        >
          <Button variant="secondary">
            <ArrowUturnLeft /> {fa ? "بازگشت" : "Back"}
          </Button>
        </LocalizedClientLink>
      </div>

      <div className="small:grid small:grid-cols-6 gap-4 flex flex-col-reverse">
        <div className="small:col-span-4 flex flex-col gap-y-2">
          {order.items?.map((item) => {
            return (
              <Container key={item.id}>
                <Item item={item} order={order} />
              </Container>
            )
          })}

          <Container>
            <OrderSummary order={order} />
          </Container>
          {manualPayment && (
            <Container>
              <div className="mb-4">
                <h2 className="font-bold">
                  {fa ? "پرداخت کارت‌به‌کارت" : "Manual payment"}
                </h2>
                {manualPayment.status === "awaiting_payment" &&
                  (paymentConfig.configured ? (
                    <div className="mt-3 rounded-xl bg-slate-50 p-4 text-sm leading-7 dark:bg-slate-950">
                      <p>{paymentConfig.card_number}</p>
                      <p>{paymentConfig.account_holder}</p>
                      {paymentConfig.bank_name && (
                        <p>{paymentConfig.bank_name}</p>
                      )}
                      {paymentConfig.instructions && (
                        <p>{paymentConfig.instructions}</p>
                      )}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                      {fa
                        ? "اطلاعات پرداخت هنوز توسط فروشگاه تنظیم نشده است."
                        : "Payment information has not been configured."}
                    </p>
                  ))}
              </div>
              <ManualPaymentStatus
                initialPayment={manualPayment}
                orderId={order.id}
                locale={locale}
              />
            </Container>
          )}
        </div>

        <div className="small:col-span-2 flex flex-col gap-y-2">
          <Container>
            <OrderDetails order={order} />
          </Container>
          <Container>
            <h3 className="font-bold">{fa ? "وضعیت ارسال" : "Fulfillment"}</h3>
            <p className="mt-2 text-sm text-slate-500">
              {fulfillmentLabel(fulfillment, locale)}
            </p>
            {order.shipping_methods?.[0]?.name && (
              <p className="mt-2 text-sm">
                {fa ? "روش ارسال" : "Shipping method"}:{" "}
                {order.shipping_methods[0].name}
              </p>
            )}
            {labels.map(
              (label: any, index: number) =>
                label.tracking_number && (
                  <p key={index} className="mt-2 text-sm">
                    {fa ? "کد رهگیری" : "Tracking"}:{" "}
                    {label.tracking_url ? (
                      <a
                        className="text-teal-700 hover:underline"
                        href={label.tracking_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {label.tracking_number}
                      </a>
                    ) : (
                      label.tracking_number
                    )}
                  </p>
                )
            )}
          </Container>

          {(!!order.shipping_address || !!order.shipping_methods?.length) && (
            <Container>
              <ShippingDetails order={order} />
            </Container>
          )}
          {!!order.billing_address && (
            <Container>
              <BillingDetails order={order} />
            </Container>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderDetailsTemplate
