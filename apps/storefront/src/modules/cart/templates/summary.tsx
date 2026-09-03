"use client"

import { useCart } from "@/lib/context/cart-context"
import { Locale } from "@/lib/i18n"
import { getCartApprovalStatus } from "@/lib/util/get-cart-approval-status"
import { getCheckoutStep } from "@/lib/util/get-checkout-step"
import CartTotals from "@/modules/cart/components/cart-totals"
import Button from "@/modules/common/components/button"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { B2BCustomer } from "@/types"
import { ExclamationCircle } from "@medusajs/icons"
import { useState } from "react"
import { useParams } from "next/navigation"

type Props = { customer: B2BCustomer | null; spendLimitExceeded: boolean; locale: Locale }

const Summary = ({ customer, spendLimitExceeded, locale }: Props) => {
  const { handleEmptyCart, cart, isUpdatingCart } = useCart()
  const [isClearing, setIsClearing] = useState(false)
  const { countryCode } = useParams<{ countryCode: string }>()
  if (!cart) return null
  const fa = locale === "fa"
  const checkoutStep = getCheckoutStep(cart)
  const checkoutPath = checkoutStep ? `/checkout?step=${checkoutStep}` : "/checkout"
  const checkoutButtonLink = customer ? checkoutPath : `/account/login?return_to=${encodeURIComponent(`/${countryCode}${checkoutPath}`)}`
  const approval = getCartApprovalStatus(cart)
  const isPendingApproval = approval.isPendingAdminApproval || approval.isPendingSalesManagerApproval

  const clearCart = async () => {
    const confirmed = window.confirm(fa ? "همه کالاهای سبد خرید حذف شوند؟" : "Remove all items from your cart?")
    if (!confirmed) return
    setIsClearing(true)
    try { await handleEmptyCart() } finally { setIsClearing(false) }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.07)] dark:border-slate-800 dark:bg-slate-900 small:p-6">
      <h2 className="text-xl font-black">{fa ? "خلاصه سفارش" : "Order summary"}</h2>
      <CartTotals locale={locale} />
      {spendLimitExceeded && <div className="mt-4 flex items-start gap-2 rounded-lg bg-orange-50 p-3 text-xs leading-5 text-orange-900 dark:bg-orange-950/40 dark:text-orange-200"><ExclamationCircle className="mt-0.5 shrink-0 text-orange-500" /><p>{fa ? "مبلغ سفارش از سقف خرید حساب حرفه‌ای بیشتر است. برای ادامه با مدیر حساب تماس بگیرید." : "This order exceeds your professional account spending limit. Contact your account manager to continue."}</p></div>}
      <LocalizedClientLink href={checkoutButtonLink} data-testid="checkout-button" className="mt-5 block">
        <Button className="w-full" size="large" disabled={spendLimitExceeded || isPendingApproval || isUpdatingCart}>{spendLimitExceeded ? fa ? "سقف خرید رد شده" : "Spending limit exceeded" : fa ? "ادامه ثبت سفارش" : "Continue to checkout"}</Button>
      </LocalizedClientLink>
      <button type="button" onClick={clearCart} disabled={isClearing || isUpdatingCart || isPendingApproval} className="mx-auto mt-4 block min-h-9 rounded-md px-3 text-xs font-semibold text-slate-500 underline-offset-4 transition-colors hover:text-red-600 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:text-red-400 motion-reduce:transition-none">
        {isClearing ? fa ? "در حال خالی کردن…" : "Clearing…" : fa ? "خالی کردن سبد خرید" : "Clear cart"}
      </button>
    </div>
  )
}

export default Summary
