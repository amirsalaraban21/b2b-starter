"use client"

import { useCart } from "@/lib/context/cart-context"
import { Locale } from "@/lib/i18n"
import { checkSpendingLimit } from "@/lib/util/check-spending-limit"
import { getCheckoutStep } from "@/lib/util/get-checkout-step"
import { getCartApprovalStatus } from "@/lib/util/get-cart-approval-status"
import { convertToLocale } from "@/lib/util/money"
import ApprovalStatusBanner from "@/modules/cart/components/approval-status-banner"
import CartDrawerItem from "@/modules/cart/components/cart-drawer-item"
import Button from "@/modules/common/components/button"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import ShoppingBag from "@/modules/common/icons/shopping-bag"
import { B2BCustomer } from "@/types"
import { StoreFreeShippingPrice } from "@/types/shipping-option/http"
import { ExclamationCircle, XMark } from "@medusajs/icons"
import { Drawer } from "@medusajs/ui"
import { useParams, usePathname } from "next/navigation"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

type CartDrawerProps = { customer: B2BCustomer | null; freeShippingPrices: StoreFreeShippingPrice[]; locale: Locale }

const CartDrawer = ({ customer, locale, ...props }: CartDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { cart, isUpdatingCart } = useCart()
  const pathname = usePathname()
  const { countryCode } = useParams<{ countryCode: string }>()
  const fa = locale === "fa"
  const items = cart?.items || []
  const totalItems = items.reduce((total, item) => total + item.quantity, 0)
  const subtotal = cart?.item_subtotal ?? 0
  const formattedSubtotal = convertToLocale({ amount: subtotal, currency_code: cart?.currency_code || "irr", locale: fa ? "fa-IR" : "en-US" })
  const spendLimitExceeded = useMemo(() => checkSpendingLimit(cart, customer), [cart, customer])
  const approvalStatus = getCartApprovalStatus(cart)
  const isPendingApproval = approvalStatus.isPendingAdminApproval || approvalStatus.isPendingSalesManagerApproval
  const previousItemCount = useRef(totalItems)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const close = useCallback(() => setIsOpen(false), [])
  const cancelTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])
  const timedOpen = useCallback(() => {
    if (!isOpen) {
      setIsOpen(true)
      timerRef.current = setTimeout(close, 5000)
    }
  }, [close, isOpen])

  useEffect(() => cancelTimer, [cancelTimer])
  useEffect(() => {
    if (previousItemCount.current !== totalItems && !pathname.includes("/cart") && !pathname.includes("/account")) { timedOpen(); previousItemCount.current = totalItems }
  }, [pathname, timedOpen, totalItems])
  useEffect(() => { cancelTimer(); close() }, [cancelTimer, close, pathname])

  const checkoutStep = cart ? getCheckoutStep(cart) : undefined
  const checkoutRoute = checkoutStep ? `/checkout?step=${checkoutStep}` : "/checkout"
  const checkoutPath = customer ? checkoutRoute : `/account/login?return_to=${encodeURIComponent(`/${countryCode}${checkoutRoute}`)}`

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} onMouseEnter={cancelTimer} {...(props as any)}>
      <Drawer.Trigger asChild>
        <button type="button" aria-label={fa ? `سبد خرید، ${totalItems.toLocaleString("fa-IR")} کالا` : `Cart, ${totalItems} items`} className="relative inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg px-2 text-sm font-medium text-slate-600 outline-none transition-colors duration-200 hover:bg-slate-100 hover:text-teal-700 focus-visible:ring-2 focus-visible:ring-teal-600 dark:text-slate-300 dark:hover:bg-slate-800 motion-reduce:transition-none">
          <ShoppingBag />
          <span className="hidden small:inline-block">{items.length ? formattedSubtotal : fa ? "سبد خرید" : "Cart"}</span>
          <span className="grid min-w-5 place-items-center rounded-full bg-teal-700 px-1.5 py-0.5 text-[11px] text-white">{fa ? totalItems.toLocaleString("fa-IR") : totalItems}</span>
        </button>
      </Drawer.Trigger>
      <Drawer.Content dir={fa ? "rtl" : "ltr"} className="fixed inset-y-0 end-0 z-50 m-0 flex h-dvh w-full max-w-[460px] flex-col rounded-none border-s border-slate-200 bg-white p-0 shadow-2xl outline-none dark:border-slate-700 dark:bg-slate-950 motion-reduce:transition-none" onMouseEnter={cancelTimer}>
        <Drawer.Header className="flex shrink-0 flex-row items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div><Drawer.Title className="text-xl font-bold text-slate-950 dark:text-white">{fa ? "سبد خرید" : "Shopping cart"}</Drawer.Title><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{fa ? `${totalItems.toLocaleString("fa-IR")} کالا در سبد خرید` : `${totalItems} ${totalItems === 1 ? "item" : "items"} in your cart`}</p></div>
          <button type="button" onClick={close} aria-label={fa ? "بستن سبد خرید" : "Close cart"} className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 dark:hover:bg-slate-800 dark:hover:text-white motion-reduce:transition-none"><XMark /></button>
        </Drawer.Header>
        {!items.length ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 py-12 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300"><ShoppingBag /></span>
            <h2 className="mt-5 text-lg font-bold text-slate-950 dark:text-white">{fa ? "سبد خرید شما خالی است" : "Your cart is empty"}</h2>
            <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500 dark:text-slate-400">{fa ? "هنوز محصولی به سبد خرید اضافه نکرده‌اید." : "You haven't added any products to your cart yet."}</p>
            <LocalizedClientLink href="/store" onClick={close} className="mt-6"><Button size="large">{fa ? "مشاهده محصولات" : "Browse products"}</Button></LocalizedClientLink>
          </div>
        ) : (
          <>
            {cart?.approvals && cart.approvals.length > 0 && <div className="shrink-0 px-5 pt-4"><ApprovalStatusBanner cart={cart} locale={locale} /></div>}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-2"><ul className="divide-y divide-slate-200 dark:divide-slate-800">{items.map((item) => <li key={item.id} className="py-4 first:pt-3"><CartDrawerItem item={item} currencyCode={cart?.currency_code || "irr"} locale={locale} disabled={isUpdatingCart || isPendingApproval} /></li>)}</ul></div>
            <div className="shrink-0 border-t border-slate-200 bg-slate-50/90 px-5 py-5 dark:border-slate-800 dark:bg-slate-900/80">
              <div className="flex items-baseline justify-between gap-4"><span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{fa ? "جمع کالاها" : "Subtotal"}</span><span className="text-xl font-black text-slate-950 dark:text-white" aria-live="polite">{formattedSubtotal}</span></div>
              <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{fa ? "هزینه ارسال در مرحله بعد مشخص می‌شود." : "Shipping is calculated at the next step."}</p>
              <div className="mt-4 grid gap-2.5"><LocalizedClientLink href={checkoutPath} onClick={close}><Button className="w-full" size="large" disabled={spendLimitExceeded}>{spendLimitExceeded ? fa ? "سقف خرید رد شده" : "Spending limit exceeded" : fa ? "ادامه ثبت سفارش" : "Continue to checkout"}</Button></LocalizedClientLink><LocalizedClientLink href="/cart" onClick={close}><Button variant="secondary" className="w-full" size="large">{fa ? "مشاهده سبد خرید" : "View cart"}</Button></LocalizedClientLink></div>
              {spendLimitExceeded && <div className="mt-3 flex items-start gap-2 rounded-lg bg-orange-50 p-3 text-xs leading-5 text-orange-900 dark:bg-orange-950/40 dark:text-orange-200"><ExclamationCircle className="mt-0.5 shrink-0 text-orange-500" /><p>{fa ? "مبلغ این سفارش از سقف خرید حساب حرفه‌ای بیشتر است." : "This order exceeds your professional account spending limit."}</p></div>}
            </div>
          </>
        )}
      </Drawer.Content>
    </Drawer>
  )
}

export default CartDrawer
