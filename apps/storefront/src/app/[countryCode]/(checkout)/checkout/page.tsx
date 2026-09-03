import { retrieveCart } from "@/lib/data/cart"
import { retrieveCustomer } from "@/lib/data/customer"
import { listCartShippingMethods } from "@/lib/data/fulfillment"
import { getManualPaymentConfig } from "@/lib/data/manual-payment"
import { getLocale } from "@/lib/i18n"
import ManualCheckout from "@/modules/checkout/templates/manual-checkout"
import { B2BCart } from "@/types/global"
import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { cookies } from "next/headers"

export const metadata: Metadata = {
  title: "Checkout",
}

export default async function Checkout({
  searchParams,
  params,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
  params: Promise<{ countryCode: string }>
}) {
  const query = await searchParams
  const { countryCode } = await params
  const cartId = query?.cartId as string
  const cart = (await retrieveCart(cartId)) as B2BCart

  if (!cart) {
    return notFound()
  }

  const customer = await retrieveCustomer()
  if (!customer)
    redirect(
      `/${countryCode}/account?return_to=${encodeURIComponent(
        `/${countryCode}/checkout?cartId=${cart.id}`
      )}`
    )
  const locale = getLocale((await cookies()).get("earmed-locale")?.value)
  const [shippingMethods, config] = await Promise.all([
    listCartShippingMethods(cart.id),
    getManualPaymentConfig(locale),
  ])

  return (
    <ManualCheckout
      cart={cart}
      customer={customer}
      shippingMethods={shippingMethods || []}
      config={config}
      locale={locale}
      countryCode={countryCode}
    />
  )
}
