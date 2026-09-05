"use client"

import { Text } from "@medusajs/ui"

import { checkSpendingLimit } from "@/lib/util/check-spending-limit"
import PaymentButton from "@/modules/checkout/components/payment-button"
import Button from "@/modules/common/components/button"
import { B2BCart, B2BCustomer } from "@/types"
import { ExclamationCircle } from "@medusajs/icons"
import { useEffect, useState } from "react"

const Review = ({
  cart,
  customer,
}: {
  cart: B2BCart
  customer: B2BCustomer | null
}) => {
  const [locale, setLocale] = useState<"fa" | "en">("fa")
  useEffect(() => setLocale(document.documentElement.lang === "en" ? "en" : "fa"), [])
  const spendLimitExceeded = customer
    ? checkSpendingLimit(cart, customer)
    : false

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-start gap-x-1 w-full">
        <Text className="txt-xsmall text-neutral-500 mb-1">
          {locale === "fa"
            ? "پیش از ثبت سفارش، کالاها، نشانی ارسال و مبلغ نهایی را بررسی کنید. وضعیت پرداخت دستی پس از بررسی رسید مشخص می‌شود."
            : "Before placing the order, review the items, shipping address, and final total. Manual payment remains pending until the receipt is reviewed."}
        </Text>
      </div>
      {spendLimitExceeded ? (
        <>
          <div className="flex items-center gap-x-2 bg-neutral-100 p-3 rounded-md shadow-borders-base">
            <ExclamationCircle className="text-orange-500 w-fit overflow-visible" />
            <p className="text-neutral-950 text-xs">
              This order exceeds your spending limit.
              <br />
              Please contact your manager for approval.
            </p>
          </div>
          <Button className="w-full h-10 rounded-full shadow-none" disabled>
            Place Order
          </Button>
        </>
      ) : (
        <PaymentButton cart={cart} data-testid="submit-order-button" />
      )}
    </div>
  )
}

export default Review
