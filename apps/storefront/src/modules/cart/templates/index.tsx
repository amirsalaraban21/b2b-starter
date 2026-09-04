"use client"

import { useCart } from "@/lib/context/cart-context"
import { Locale } from "@/lib/i18n"
import { checkSpendingLimit } from "@/lib/util/check-spending-limit"
import ApprovalStatusBanner from "@/modules/cart/components/approval-status-banner"
import CartPageItem from "@/modules/cart/components/cart-page-item"
import EmptyCartMessage from "@/modules/cart/components/empty-cart-message"
import Summary from "@/modules/cart/templates/summary"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { B2BCustomer } from "@/types/global"
import { useMemo } from "react"

const CartTemplate = ({
  customer,
  locale,
  isApprovedProfessional,
}: {
  customer: B2BCustomer | null
  locale: Locale
  isApprovedProfessional: boolean
}) => {
  const { cart } = useCart()
  const fa = locale === "fa"
  const spendLimitExceeded = useMemo(
    () => checkSpendingLimit(cart, customer),
    [cart, customer]
  )
  const totalItems =
    cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0

  return (
    <main
      dir={fa ? "rtl" : "ltr"}
      className="min-h-[60vh] bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50"
    >
      <div
        className="content-container py-8 small:py-12"
        data-testid="cart-container"
      >
        {cart?.items?.length ? (
          <>
            <header className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-6 dark:border-slate-800">
              <div>
                <h1 className="text-3xl font-black tracking-tight small:text-4xl">
                  {fa ? "سبد خرید" : "Shopping cart"}
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {fa
                    ? `${totalItems.toLocaleString(
                        "fa-IR"
                      )} کالا در سبد خرید شما`
                    : `${totalItems} ${
                        totalItems === 1 ? "item" : "items"
                      } in your cart`}
                </p>
              </div>
              <LocalizedClientLink
                href="/store"
                className="text-sm font-bold text-teal-700 underline-offset-4 transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 dark:text-teal-300 motion-reduce:transition-none"
              >
                {fa ? "ادامه خرید" : "Continue shopping"}
              </LocalizedClientLink>
            </header>

            {cart.approvals && cart.approvals.length > 0 && (
              <div className="mb-5">
                <ApprovalStatusBanner cart={cart} locale={locale} />
              </div>
            )}

            <div className="grid items-start gap-7 small:grid-cols-[minmax(0,1fr)_340px] medium:grid-cols-[minmax(0,1fr)_380px]">
              <section
                aria-label={fa ? "کالاهای سبد خرید" : "Cart items"}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white px-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 small:px-6"
              >
                <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                  {cart.items.map((item) => (
                    <li key={item.id} className="py-5">
                      <CartPageItem
                        item={item}
                        currencyCode={cart.currency_code}
                        locale={locale}
                      />
                    </li>
                  ))}
                </ul>
              </section>
              <aside className="small:sticky small:top-24">
                <Summary
                  customer={customer}
                  spendLimitExceeded={spendLimitExceeded}
                  locale={locale}
                  isApprovedProfessional={isApprovedProfessional}
                />
              </aside>
            </div>
          </>
        ) : (
          <EmptyCartMessage locale={locale} />
        )}
      </div>
    </main>
  )
}

export default CartTemplate
