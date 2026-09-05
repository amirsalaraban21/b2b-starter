import { CartProvider } from "@/lib/context/cart-context"
import { retrieveCart } from "@/lib/data/cart"
import { retrieveCustomer } from "@/lib/data/customer"
import CartTemplate from "@/modules/cart/templates"
import { Metadata } from "next"
import { cookies } from "next/headers"
import { getLocale } from "@/lib/i18n"
import { getProfessionalApplication } from "@/lib/data/professional-application"

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocale((await cookies()).get("earmed-locale")?.value)
  return {
    title: locale === "fa" ? "سبد خرید" : "Shopping cart",
    description:
      locale === "fa"
        ? "مشاهده و مدیریت سبد خرید"
        : "Review and manage your shopping cart",
  }
}

export default async function Cart() {
  const locale = getLocale((await cookies()).get("earmed-locale")?.value)
  const cart = await retrieveCart().catch(() => null)
  const customer = await retrieveCustomer()
  const application = customer
    ? await getProfessionalApplication().catch(() => null)
    : null

  return (
    <CartProvider cart={cart}>
      <CartTemplate
        customer={customer}
        locale={locale}
        isApprovedProfessional={application?.status === "approved"}
      />
    </CartProvider>
  )
}
