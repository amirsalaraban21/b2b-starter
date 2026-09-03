"use client"

import { useCart } from "@/lib/context/cart-context"
import { Locale } from "@/lib/i18n"
import { convertToLocale } from "@/lib/util/money"

const CartTotals = ({ locale }: { locale: Locale }) => {
  const { isUpdatingCart, cart } = useCart()
  if (!cart) return null
  const fa = locale === "fa"
  const format = (amount: number) => convertToLocale({ amount, currency_code: cart.currency_code, locale: fa ? "fa-IR" : "en-US" })
  const currentAmount = cart.total ?? Math.max((cart.item_subtotal ?? 0) - (cart.discount_total ?? 0) - (cart.gift_card_total ?? 0), 0)

  return (
    <div className="mt-5 border-t border-slate-200 pt-5 dark:border-slate-800">
      <dl className="space-y-3 text-sm">
        <div className="flex items-center justify-between gap-4"><dt className="text-slate-600 dark:text-slate-300">{fa ? "جمع کالاها" : "Items subtotal"}</dt><dd className="font-bold" data-testid="cart-item-subtotal" data-value={cart.item_subtotal || 0}>{format(cart.item_subtotal ?? 0)}</dd></div>
        {!!cart.discount_total && <div className="flex items-center justify-between gap-4 text-teal-700 dark:text-teal-300"><dt>{fa ? "تخفیف" : "Discount"}</dt><dd className="font-bold" data-testid="cart-discount" data-value={cart.discount_total}>− {format(cart.discount_total)}</dd></div>}
        {!!cart.gift_card_total && <div className="flex items-center justify-between gap-4 text-teal-700 dark:text-teal-300"><dt>{fa ? "کارت هدیه" : "Gift card"}</dt><dd className="font-bold">− {format(cart.gift_card_total)}</dd></div>}
        <div className="flex items-start justify-between gap-4"><dt className="text-slate-600 dark:text-slate-300">{fa ? "هزینه ارسال" : "Shipping"}</dt><dd className="max-w-[190px] text-end text-xs leading-5 text-slate-500 dark:text-slate-400">{cart.shipping_total ? format(cart.shipping_total) : fa ? "در مرحله بعد محاسبه می‌شود" : "Calculated at the next step"}</dd></div>
        {!!cart.tax_total && <div className="flex items-center justify-between gap-4"><dt className="text-slate-600 dark:text-slate-300">{fa ? "مالیات" : "Taxes"}</dt><dd className="font-bold">{format(cart.tax_total)}</dd></div>}
      </dl>
      <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-slate-200 pt-5 dark:border-slate-800"><span className="font-bold">{fa ? "مبلغ فعلی" : "Current amount"}</span>{isUpdatingCart ? <span className="h-7 w-32 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700 motion-reduce:animate-none" /> : <strong className="text-xl font-black" data-testid="cart-total" data-value={currentAmount}>{format(currentAmount)}</strong>}</div>
      {!cart.shipping_total && <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{fa ? "مبلغ نهایی پس از انتخاب روش ارسال مشخص می‌شود." : "The final amount is confirmed after you select shipping."}</p>}
    </div>
  )
}

export default CartTotals
