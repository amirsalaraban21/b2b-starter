import { ManualPayment } from "@/lib/data/manual-payment"
import { Locale } from "@/lib/i18n"
import { convertToLocale } from "@/lib/util/money"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import ManualPaymentStatus from "@/modules/order/components/manual-payment-status"
import { B2BOrder } from "@/types/global"

type Props = { order: B2BOrder; payment: ManualPayment; locale: Locale }

export default function OrderCompletedTemplate({
  order,
  payment,
  locale,
}: Props) {
  const fa = locale === "fa"
  const number = new Intl.NumberFormat(fa ? "fa-IR" : "en-US")
  const money = (amount: number) =>
    convertToLocale({
      amount,
      currency_code: order.currency_code,
      locale: fa ? "fa-IR" : "en-US",
    })
  const address = order.shipping_address
  return (
    <main className="min-h-[calc(100vh-64px)] bg-slate-50 py-10 dark:bg-slate-950">
      <div className="content-container max-w-4xl">
        <article
          className="space-y-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-10"
          data-testid="order-complete-container"
        >
          <header>
            <p className="text-sm font-bold text-teal-700 dark:text-teal-300">
              {fa
                ? `سفارش شماره ${number.format(order.display_id || 0)}`
                : `Order #${number.format(order.display_id || 0)}`}
            </p>
            <h1 className="mt-2 text-3xl font-black">
              {fa ? "سفارش شما ثبت شد" : "Your order was placed"}
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {fa
                ? "پرداخت هنوز تأیید نشده است. برای ادامه، رسید پرداخت کارت‌به‌کارت را ارسال کنید."
                : "Payment is not approved yet. Submit your manual-payment receipt to continue."}
            </p>
          </header>
          <ManualPaymentStatus
            initialPayment={payment}
            orderId={order.id}
            locale={locale}
          />
          <section>
            <h2 className="text-xl font-black">
              {fa ? "محصولات سفارش" : "Order items"}
            </h2>
            <div className="mt-4 divide-y divide-slate-200 dark:divide-slate-800">
              {order.items?.map((item) => {
                const metadata = item.product?.metadata as
                  | Record<string, unknown>
                  | undefined
                const title =
                  fa && typeof metadata?.fa_title === "string"
                    ? metadata.fa_title
                    : item.title
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    <div>
                      <p className="font-bold">{title}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {fa ? "تعداد" : "Quantity"}:{" "}
                        {number.format(Number(item.quantity))}
                      </p>
                    </div>
                    <span className="font-bold">
                      {money(Number(item.total || 0))}
                    </span>
                  </div>
                )
              })}
            </div>
          </section>
          <section className="rounded-2xl bg-slate-50 p-5 text-sm dark:bg-slate-950/60">
            <h2 className="font-black">
              {fa ? "خلاصه مبلغ" : "Payment summary"}
            </h2>
            <div className="mt-4 space-y-3">
              <Row
                label={fa ? "جمع کالاها" : "Subtotal"}
                value={money(order.item_subtotal || 0)}
              />
              <Row
                label={fa ? "هزینه ارسال" : "Shipping"}
                value={money(order.shipping_total || 0)}
              />
              {!!order.discount_total && (
                <Row
                  label={fa ? "تخفیف" : "Discount"}
                  value={`− ${money(order.discount_total)}`}
                />
              )}
              <div className="flex justify-between border-t border-slate-200 pt-4 text-base font-black dark:border-slate-800">
                <span>{fa ? "مبلغ قابل پرداخت" : "Amount due"}</span>
                <span>{money(order.total || 0)}</span>
              </div>
            </div>
          </section>
          <section className="grid gap-5 sm:grid-cols-2">
            <div>
              <h2 className="font-black">
                {fa ? "آدرس تحویل" : "Delivery address"}
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {address?.first_name} {address?.last_name}
                <br />
                {address?.province}، {address?.city}
                <br />
                {address?.address_1}
                <br />
                {address?.postal_code}
                <br />
                <span dir="ltr">{address?.phone}</span>
              </p>
            </div>
            <div>
              <h2 className="font-black">
                {fa ? "روش پرداخت" : "Payment method"}
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {fa ? "کارت‌به‌کارت" : "Manual card payment"}
              </p>
            </div>
          </section>
          <LocalizedClientLink
            href="/account/orders"
            className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-slate-300 px-5 text-sm font-bold transition hover:border-teal-600 dark:border-slate-700"
          >
            {fa
              ? "مشاهده سفارش‌ها در حساب کاربری"
              : "View orders in your account"}
          </LocalizedClientLink>
        </article>
      </div>
    </main>
  )
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between text-slate-600 dark:text-slate-300">
    <span>{label}</span>
    <span>{value}</span>
  </div>
)
