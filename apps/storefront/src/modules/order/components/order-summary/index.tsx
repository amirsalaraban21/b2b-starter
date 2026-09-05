import { convertToLocale } from "@/lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OrderSummaryProps = {
  order: HttpTypes.StoreOrder
}

const OrderSummary = ({ order }: OrderSummaryProps) => {
  const getAmount = (amount?: number | null) => {
    if (!amount) {
      return
    }

    return convertToLocale({
      amount,
      currency_code: order.currency_code,
    })
  }

  return (
    <div>
      <h2 className="text-base-semi">Order Summary</h2>
      <div className="text-small-regular text-ui-fg-base my-2">
        <div className="flex flex-col gap-y-1">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
            <span>Subtotal</span>
            <span className="max-w-full break-words text-end">{getAmount(order.subtotal)}</span>
          </div>

          {order.discount_total > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
              <span>Discount</span>
              <span className="max-w-full break-words text-end">- {getAmount(order.discount_total)}</span>
            </div>
          )}
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
            <span>Shipping</span>
            <span className="max-w-full break-words text-end">{getAmount(order.shipping_total)}</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
            <span>Taxes</span>
            <span className="max-w-full break-words text-end">{getAmount(order.tax_total)}</span>
          </div>
        </div>
        <div className="h-px w-full border-b border-gray-200 border-dashed my-4" />
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-base-regular text-ui-fg-base mb-2">
          <span>Total</span>
          <span className="max-w-full break-words text-end">{getAmount(order.total)}</span>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary
