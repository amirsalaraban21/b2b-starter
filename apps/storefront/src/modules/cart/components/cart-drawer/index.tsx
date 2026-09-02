"use client"

import { useCart } from "@/lib/context/cart-context"
import { checkSpendingLimit } from "@/lib/util/check-spending-limit"
import { getCheckoutStep } from "@/lib/util/get-checkout-step"
import { convertToLocale } from "@/lib/util/money"
import AppliedPromotions from "@/modules/cart/components/applied-promotions"
import ApprovalStatusBanner from "@/modules/cart/components/approval-status-banner"
import ItemsTemplate from "@/modules/cart/templates/items"
import Button from "@/modules/common/components/button"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import ShoppingBag from "@/modules/common/icons/shopping-bag"
import FreeShippingPriceNudge from "@/modules/shipping/components/free-shipping-price-nudge"
import { B2BCustomer } from "@/types"
import { StoreFreeShippingPrice } from "@/types/shipping-option/http"
import { ExclamationCircle, LockClosedSolidMini } from "@medusajs/icons"
import { StoreCart } from "@medusajs/types"
import { Drawer, Text } from "@medusajs/ui"
import { usePathname } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"

const isFaPath = (pathname: string) => pathname.split("/").filter(Boolean)[0] === "ir"

type CartDrawerProps = {
  customer: B2BCustomer | null
  freeShippingPrices: StoreFreeShippingPrice[]
}

const CartDrawer = ({ customer, freeShippingPrices, ...props }: CartDrawerProps) => {
  const [activeTimer, setActiveTimer] = useState<ReturnType<typeof setTimeout> | undefined>()
  const [isOpen, setIsOpen] = useState(false)
  const { cart } = useCart()
  const pathname = usePathname()
  const fa = isFaPath(pathname)

  const items = cart?.items || []
  const promotions = cart?.promotions || []
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)
  const subtotal = useMemo(() => cart?.item_subtotal ?? 0, [cart])
  const spendLimitExceeded = useMemo(() => checkSpendingLimit(cart, customer), [cart, customer])
  const itemRef = useRef<number>(totalItems || 0)

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)
  const cancelTimer = () => activeTimer && clearTimeout(activeTimer)

  const timedOpen = () => {
    if (isOpen) return
    open()
    const timer = setTimeout(close, 5000)
    setActiveTimer(timer)
  }

  useEffect(() => () => activeTimer && clearTimeout(activeTimer), [activeTimer])

  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart") && !pathname.includes("/account")) {
      timedOpen()
      itemRef.current = totalItems
    }
  }, [totalItems])

  useEffect(() => {
    cancelTimer()
    close()
  }, [pathname])

  const checkoutStep = cart ? getCheckoutStep(cart) : undefined
  const checkoutPath = customer ? (checkoutStep ? `/checkout?step=${checkoutStep}` : "/checkout") : "/account"

  return (
    <>
      {isOpen && <div className="fixed inset-[-2rem] z-10 backdrop-blur-sm p-0" />}
      <Drawer onMouseEnter={cancelTimer} className="z-50 m-0 rounded-none bg-none p-0" open={isOpen} onOpenChange={setIsOpen} {...(props as any)}>
        <Drawer.Trigger asChild>
          <button className="relative inline-flex min-h-10 w-fit items-center justify-center gap-x-1.5 px-2 text-sm font-medium text-slate-600 outline-none transition hover:text-teal-700 dark:text-slate-300">
            <ShoppingBag />
            <span className="hidden small:inline-block">
              {cart && items.length > 0
                ? convertToLocale({ amount: subtotal, currency_code: cart.currency_code })
                : fa ? "سبد خرید" : "Cart"}
            </span>
            <span className="grid min-w-5 place-items-center rounded-full bg-teal-700 px-1.5 py-0.5 text-[11px] text-white">{totalItems}</span>
          </button>
        </Drawer.Trigger>

        <Drawer.Content className="z-50 m-0 rounded-none p-0 inset-y-0 sm:right-0" onMouseEnter={cancelTimer}>
          <Drawer.Header className="flex self-center">
            <Drawer.Title>
              {totalItems > 0
                ? fa ? `${totalItems} کالا در سبد خرید` : `${totalItems} items in your cart`
                : fa ? "سبد خرید شما خالی است" : "Your cart is empty"}
            </Drawer.Title>
          </Drawer.Header>

          {cart?.approvals && cart.approvals.length > 0 && <div className="p-4"><ApprovalStatusBanner cart={cart} /></div>}
          {promotions.length > 0 && <div className="p-4"><AppliedPromotions promotions={promotions} /></div>}

          <div className="flex h-full flex-col justify-between gap-y-4 self-stretch overflow-auto">
            {cart && cart.items && (
              <>
                <ItemsTemplate cart={cart} showBorders={false} showTotal={false} />
                <div className="flex w-full flex-col gap-y-3 border-t border-ui-border-base p-4">
                  {freeShippingPrices && <FreeShippingPriceNudge variant="inline" cart={cart as StoreCart} freeShippingPrices={freeShippingPrices} />}
                  <div className="flex justify-between">
                    <Text>{fa ? "جمع کالاها" : "Subtotal"}</Text>
                    <Text>{convertToLocale({ amount: subtotal, currency_code: cart.currency_code })}</Text>
                  </div>
                  <div className="flex flex-col gap-y-2">
                    <LocalizedClientLink href="/cart">
                      <Button variant="secondary" className="w-full" size="large">{fa ? "مشاهده سبد خرید" : "View cart"}</Button>
                    </LocalizedClientLink>
                    <LocalizedClientLink href={checkoutPath}>
                      <Button className="w-full" size="large" disabled={totalItems === 0 || spendLimitExceeded}>
                        <LockClosedSolidMini />
                        {customer
                          ? spendLimitExceeded
                            ? fa ? "سقف خرید رد شده" : "Spending limit exceeded"
                            : fa ? "ادامه ثبت سفارش" : "Continue to checkout"
                          : fa ? "برای ادامه وارد شوید" : "Log in to checkout"}
                      </Button>
                    </LocalizedClientLink>
                    {spendLimitExceeded && (
                      <div className="flex items-center gap-x-2 bg-neutral-100 p-3 text-xs text-neutral-950">
                        <ExclamationCircle className="w-fit overflow-visible text-orange-500" />
                        <p>{fa ? "مبلغ این سفارش از سقف خرید حساب حرفه‌ای بیشتر است." : "This order exceeds your professional account spending limit."}</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </Drawer.Content>
      </Drawer>
    </>
  )
}

export default CartDrawer
