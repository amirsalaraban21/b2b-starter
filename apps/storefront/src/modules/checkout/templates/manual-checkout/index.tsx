"use client"

import {
  completeManualCheckout,
  ManualPaymentConfig,
  saveCheckoutAddress,
} from "@/lib/data/manual-payment"
import { setShippingMethod } from "@/lib/data/cart"
import {
  iranProvinces,
  isIranianPostalCode,
  normalizeIranianMobile,
  normalizeIranianPostalCode,
} from "@/lib/iran"
import { Locale } from "@/lib/i18n"
import { convertToLocale } from "@/lib/util/money"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { B2BCart, B2BCustomer } from "@/types"
import { HttpTypes } from "@medusajs/types"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { FormEvent, useMemo, useState, useTransition } from "react"

type Props = {
  cart: B2BCart
  customer: B2BCustomer
  shippingMethods: HttpTypes.StoreCartShippingOption[]
  config: ManualPaymentConfig
  locale: Locale
  countryCode: string
}
const steps = ["address", "shipping", "payment", "review"] as const
const inputClass =
  "h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"

export default function ManualCheckout({
  cart,
  customer,
  shippingMethods,
  config,
  locale,
  countryCode,
}: Props) {
  const fa = locale === "fa"
  const router = useRouter()
  const params = useSearchParams()
  const requested = params.get("step")
  const step = steps.includes(requested as any)
    ? (requested as (typeof steps)[number])
    : "address"
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const selectedShipping = shippingMethods.find(
    (option) => option.id === cart.shipping_methods?.at(-1)?.shipping_option_id
  )
  const money = (amount: number) =>
    convertToLocale({
      amount,
      currency_code: cart.currency_code,
      locale: fa ? "fa-IR" : "en-US",
    })
  const labels = fa
    ? ["آدرس", "ارسال", "پرداخت", "بررسی و ثبت سفارش"]
    : ["Address", "Shipping", "Payment", "Review & place order"]
  const go = (next: (typeof steps)[number]) =>
    router.push(`/${countryCode}/checkout?cartId=${cart.id}&step=${next}`)
  const address = cart.shipping_address

  const savedAddresses = useMemo(
    () =>
      customer.addresses?.filter((item) => item.country_code === "ir") || [],
    [customer.addresses]
  )
  const submitAddress = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    const form = new FormData(event.currentTarget)
    const mobile = String(form.get("phone") || "")
    const postal = String(form.get("postal_code") || "")
    if (!normalizeIranianMobile(mobile))
      return setError(
        fa
          ? "شماره موبایل ایران معتبر نیست."
          : "Enter a valid Iranian mobile number."
      )
    if (!isIranianPostalCode(postal))
      return setError(
        fa ? "کد پستی باید ۱۰ رقم باشد." : "Postal code must contain 10 digits."
      )
    form.set("phone", normalizeIranianMobile(mobile)!)
    form.set("postal_code", normalizeIranianPostalCode(postal))
    startTransition(async () => {
      try {
        await saveCheckoutAddress(form)
        router.refresh()
        go("shipping")
      } catch (e) {
        setError(friendlyError(e, fa))
      }
    })
  }
  const chooseShipping = (id: string) =>
    startTransition(async () => {
      try {
        setError("")
        await setShippingMethod({ cartId: cart.id, shippingMethodId: id })
        router.refresh()
      } catch (e) {
        setError(friendlyError(e, fa))
      }
    })
  const place = () =>
    startTransition(async () => {
      try {
        setError("")
        const result = await completeManualCheckout(cart.id)
        router.push(`/${countryCode}/order/confirmed/${result.orderId}`)
      } catch (e) {
        setError(friendlyError(e, fa))
        router.refresh()
      }
    })

  return (
    <main className="min-h-[calc(100vh-64px)] bg-slate-50 py-8 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="content-container">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-teal-700 dark:text-teal-300">
              EarMed Checkout
            </p>
            <h1 className="mt-2 text-2xl font-black">
              {fa ? "تکمیل سفارش" : "Complete your order"}
            </h1>
          </div>
          <LocalizedClientLink
            href="/cart"
            className="text-sm font-bold text-teal-700 hover:underline dark:text-teal-300"
          >
            {fa ? "بازگشت به سبد" : "Back to cart"}
          </LocalizedClientLink>
        </div>
        <ol className="mb-8 grid grid-cols-4 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          {steps.map((item, index) => (
            <li
              key={item}
              className={`min-w-0 break-words border-e border-slate-200 px-1 py-3 text-center text-[10px] font-bold leading-4 last:border-0 xsmall:px-2 xsmall:py-4 xsmall:text-xs dark:border-slate-800 ${
                step === item
                  ? "bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-200"
                  : "text-slate-500"
              }`}
            >
              <span className="mx-auto block xsmall:me-1 xsmall:inline">
                {new Intl.NumberFormat(fa ? "fa-IR" : "en-US", {
                  minimumIntegerDigits: 2,
                }).format(index + 1)}
              </span>
              {labels[index]}
            </li>
          ))}
        </ol>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.85fr)_minmax(320px,1fr)]">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            {step === "address" && (
              <form onSubmit={submitAddress} className="space-y-5">
                <StepTitle
                  fa={fa}
                  titleFa="آدرس تحویل"
                  titleEn="Delivery address"
                />
                {savedAddresses.length > 0 && (
                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      {fa ? "آدرس‌های ذخیره‌شده" : "Saved addresses"}
                    </label>
                    <select
                      className={inputClass}
                      onChange={(e) => {
                        const saved = savedAddresses.find(
                          (a) => a.id === e.target.value
                        )
                        if (!saved) return
                        const form = e.currentTarget.form
                        Object.entries(saved).forEach(([key, value]) => {
                          const field = form?.elements.namedItem(
                            key
                          ) as HTMLInputElement | null
                          if (field && value) field.value = String(value)
                        })
                      }}
                    >
                      <option value="">
                        {fa ? "انتخاب آدرس" : "Select an address"}
                      </option>
                      {savedAddresses.map((a) => (
                        <option value={a.id} key={a.id}>
                          {a.first_name} {a.last_name} — {a.city}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    name="first_name"
                    label={fa ? "نام" : "First name"}
                    value={address?.first_name}
                  />
                  <Field
                    name="last_name"
                    label={fa ? "نام خانوادگی" : "Last name"}
                    value={address?.last_name}
                  />
                  <Field
                    name="phone"
                    label={fa ? "شماره موبایل" : "Mobile"}
                    value={address?.phone}
                    inputMode="tel"
                  />
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold">
                      {fa ? "استان" : "Province"}
                    </span>
                    <select
                      name="province"
                      required
                      defaultValue={address?.province || ""}
                      className={inputClass}
                    >
                      <option value="">
                        {fa ? "انتخاب استان" : "Select province"}
                      </option>
                      {iranProvinces.map(([faName, en]) => (
                        <option key={en} value={en}>
                          {fa ? faName : en}
                        </option>
                      ))}
                    </select>
                  </label>
                  <Field
                    name="city"
                    label={fa ? "شهر" : "City"}
                    value={address?.city}
                  />
                  <Field
                    name="postal_code"
                    label={fa ? "کد پستی" : "Postal code"}
                    value={address?.postal_code}
                    inputMode="numeric"
                  />
                  <div className="sm:col-span-2">
                    <Field
                      name="address_1"
                      label={fa ? "نشانی کامل" : "Full address"}
                      value={address?.address_1}
                    />
                  </div>
                </div>
                <Action pending={pending}>
                  {fa ? "ادامه به روش ارسال" : "Continue to shipping"}
                </Action>
              </form>
            )}
            {step === "shipping" && (
              <div className="space-y-5">
                <StepTitle
                  fa={fa}
                  titleFa="روش ارسال"
                  titleEn="Shipping method"
                />
                {shippingMethods.length ? (
                  <div className="space-y-3">
                    {shippingMethods.map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => chooseShipping(method.id)}
                        className={`flex w-full items-center justify-between rounded-2xl border p-4 text-start transition ${
                          selectedShipping?.id === method.id
                            ? "border-teal-600 bg-teal-50 dark:bg-teal-950/30"
                            : "border-slate-200 hover:border-teal-400 dark:border-slate-700"
                        }`}
                      >
                        <span className="font-bold">{method.name}</span>
                        <span>{money(method.amount || 0)}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <Notice>
                    {fa
                      ? "در حال حاضر روش ارسال معتبری برای این سبد پیکربندی نشده است."
                      : "No configured shipping method is available for this cart."}
                  </Notice>
                )}
                <Action
                  pending={pending}
                  disabled={!selectedShipping}
                  onClick={() => go("payment")}
                >
                  {fa ? "ادامه به پرداخت" : "Continue to payment"}
                </Action>
              </div>
            )}
            {step === "payment" && (
              <div className="space-y-5">
                <StepTitle
                  fa={fa}
                  titleFa="پرداخت کارت‌به‌کارت"
                  titleEn="Manual card payment"
                />
                {config.configured ? (
                  <div className="rounded-2xl border border-teal-200 bg-teal-50 p-5 dark:border-teal-900 dark:bg-teal-950/30">
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {fa ? "شماره کارت" : "Card number"}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                      <b dir="ltr" className="text-xl tracking-wider">
                        {config.card_number}
                      </b>
                      <button
                        type="button"
                        onClick={async () => {
                          await navigator.clipboard.writeText(
                            config.card_number!
                          )
                          setCopied(true)
                        }}
                        className="rounded-xl border border-teal-600 px-3 py-2 text-xs font-bold text-teal-800 dark:text-teal-200"
                      >
                        {copied
                          ? fa
                            ? "کپی شد"
                            : "Copied"
                          : fa
                          ? "کپی شماره کارت"
                          : "Copy card"}
                      </button>
                    </div>
                    <p className="mt-4 font-bold">{config.account_holder}</p>
                    {config.bank_name && (
                      <p className="mt-1 text-sm">{config.bank_name}</p>
                    )}
                    {config.instructions && (
                      <p className="mt-4 whitespace-pre-line text-sm leading-7">
                        {config.instructions}
                      </p>
                    )}
                  </div>
                ) : (
                  <Notice>
                    {fa
                      ? "اطلاعات پرداخت هنوز توسط فروشگاه پیکربندی نشده است. ثبت سفارش تا تکمیل تنظیمات پرداخت امکان‌پذیر نیست."
                      : "Payment information has not been configured by the store. The order cannot be placed yet."}
                  </Notice>
                )}
                <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {fa
                    ? "پس از ثبت سفارش، رسید پرداخت را ارسال می‌کنید. ارسال رسید به معنی تأیید پرداخت نیست."
                    : "After placing the order, you can submit your receipt. Receipt submission is not payment approval."}
                </p>
                <Action
                  disabled={!config.configured}
                  onClick={() => go("review")}
                >
                  {fa ? "بررسی نهایی" : "Review order"}
                </Action>
              </div>
            )}
            {step === "review" && (
              <div className="space-y-5">
                <StepTitle
                  fa={fa}
                  titleFa="بررسی و ثبت سفارش"
                  titleEn="Review and place order"
                />
                <ReviewBlock
                  fa={fa}
                  cart={cart}
                  shipping={selectedShipping}
                  money={money}
                />
                <Action
                  pending={pending}
                  disabled={!config.configured || !selectedShipping}
                  onClick={place}
                >
                  {fa ? "ثبت سفارش" : "Place order"}
                </Action>
                <p className="text-xs leading-6 text-slate-500">
                  {fa
                    ? "ثبت سفارش به معنی تأیید پرداخت نیست. وضعیت اولیه پرداخت «در انتظار پرداخت» خواهد بود."
                    : "Placing the order does not approve payment. Its initial payment status will be awaiting payment."}
                </p>
              </div>
            )}
            {error && (
              <p
                role="alert"
                className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200"
              >
                {error}
              </p>
            )}
          </section>
          <Summary cart={cart} fa={fa} money={money} />
        </div>
      </div>
    </main>
  )
}

const Field = ({
  name,
  label,
  value,
  inputMode,
}: {
  name: string
  label: string
  value?: string | null
  inputMode?: "tel" | "numeric"
}) => (
  <label className="block">
    <span className="mb-2 block text-sm font-bold">{label}</span>
    <input
      className={inputClass}
      name={name}
      defaultValue={value || ""}
      inputMode={inputMode}
      required
    />
  </label>
)
const StepTitle = ({
  fa,
  titleFa,
  titleEn,
}: {
  fa: boolean
  titleFa: string
  titleEn: string
}) => (
  <div>
    <h2 className="text-xl font-black">{fa ? titleFa : titleEn}</h2>
    <div className="mt-3 h-px bg-slate-200 dark:bg-slate-800" />
  </div>
)
const Notice = ({ children }: { children: React.ReactNode }) => (
  <div
    role="status"
    className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-7 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100"
  >
    {children}
  </div>
)
const Action = ({
  children,
  pending,
  disabled,
  onClick,
}: {
  children: React.ReactNode
  pending?: boolean
  disabled?: boolean
  onClick?: () => void
}) => (
  <button
    type={onClick ? "button" : "submit"}
    onClick={onClick}
    disabled={pending || disabled}
    className="mt-3 h-12 w-full rounded-xl bg-teal-700 px-5 font-bold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {pending ? "…" : children}
  </button>
)
const ReviewBlock = ({
  fa,
  cart,
  shipping,
  money,
}: {
  fa: boolean
  cart: B2BCart
  shipping?: HttpTypes.StoreCartShippingOption
  money: (n: number) => string
}) => (
  <div className="space-y-4 text-sm">
    <div>
      <b>{fa ? "آدرس" : "Address"}</b>
      <p className="mt-1 leading-7 text-slate-600 dark:text-slate-300">
        {cart.shipping_address?.first_name} {cart.shipping_address?.last_name}،{" "}
        {cart.shipping_address?.province}، {cart.shipping_address?.city}،{" "}
        {cart.shipping_address?.address_1}، {cart.shipping_address?.postal_code}
      </p>
    </div>
    <div>
      <b>{fa ? "ارسال" : "Shipping"}</b>
      <p className="mt-1 text-slate-600 dark:text-slate-300">
        {shipping?.name} — {money(cart.shipping_total || 0)}
      </p>
    </div>
    <div>
      <b>{fa ? "روش پرداخت" : "Payment method"}</b>
      <p className="mt-1 text-slate-600 dark:text-slate-300">
        {fa ? "کارت‌به‌کارت" : "Manual card payment"}
      </p>
    </div>
  </div>
)
const Summary = ({
  cart,
  fa,
  money,
}: {
  cart: B2BCart
  fa: boolean
  money: (n: number) => string
}) => (
  <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:sticky lg:top-6">
    <h2 className="text-lg font-black">
      {fa ? "خلاصه سفارش" : "Order summary"}
    </h2>
    <div className="mt-5 max-h-80 space-y-4 overflow-auto">
      {cart.items?.map((item) => (
        <div key={item.id} className="flex gap-3">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
            {item.thumbnail && (
              <Image
                src={item.thumbnail}
                alt=""
                fill
                sizes="64px"
                className="object-contain"
              />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-sm font-bold">
              {fa
                ? String(item.product?.metadata?.fa_title || item.title)
                : item.title}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {fa ? "تعداد" : "Qty"}:{" "}
              {new Intl.NumberFormat(fa ? "fa-IR" : "en-US").format(
                Number(item.quantity)
              )}
            </p>
          </div>
          <span className="text-sm font-bold">
            {money(Number(item.total || 0))}
          </span>
        </div>
      ))}
    </div>
    <div className="mt-5 space-y-2 border-t border-slate-200 pt-4 text-sm dark:border-slate-800">
      <Row
        label={fa ? "جمع کالاها" : "Subtotal"}
        value={money(cart.item_subtotal || 0)}
      />
      <Row
        label={fa ? "ارسال" : "Shipping"}
        value={money(cart.shipping_total || 0)}
      />
      {!!cart.discount_total && (
        <Row
          label={fa ? "تخفیف" : "Discount"}
          value={`− ${money(cart.discount_total)}`}
        />
      )}
      <div className="mt-3 flex justify-between border-t border-slate-200 pt-4 text-base font-black dark:border-slate-800">
        <span>{fa ? "مبلغ قابل پرداخت" : "Total"}</span>
        <span>{money(cart.total || 0)}</span>
      </div>
    </div>
  </aside>
)
const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between text-slate-600 dark:text-slate-300">
    <span>{label}</span>
    <span>{value}</span>
  </div>
)
const friendlyError = (error: unknown, fa: boolean) => {
  const value = error instanceof Error ? error.message : String(error)
  const map: Record<string, [string, string]> = {
    INVALID_MOBILE: [
      "شماره موبایل ایران معتبر نیست.",
      "Enter a valid Iranian mobile number.",
    ],
    INVALID_POSTAL_CODE: [
      "کد پستی باید ۱۰ رقم باشد.",
      "Postal code must contain 10 digits.",
    ],
    INVALID_ADDRESS: [
      "آدرس تحویل معتبر نیست.",
      "The delivery address is invalid.",
    ],
    INCOMPLETE_ADDRESS: [
      "لطفاً همه اطلاعات ضروری آدرس را کامل کنید.",
      "Complete all required address fields.",
    ],
    MISSING_SHIPPING: [
      "روش ارسال معتبر انتخاب نشده است.",
      "Select a valid shipping method.",
    ],
    MISSING_MANUAL_PROVIDER: [
      "روش پرداخت دستی برای این منطقه فعال نیست.",
      "Manual payment is not enabled for this region.",
    ],
    CART_CHANGED: [
      "سبد خرید تغییر کرده است؛ لطفاً دوباره بررسی کنید.",
      "Your cart changed. Please review it again.",
    ],
  }
  return map[value]?.[fa ? 0 : 1] || value
}
