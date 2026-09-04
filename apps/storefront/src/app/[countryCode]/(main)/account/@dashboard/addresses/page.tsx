import { retrieveCustomer } from "@/lib/data/customer"
import { getRegion } from "@/lib/data/regions"
import AddressBook from "@/modules/account/components/address-book"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import { getLocale } from "@/lib/i18n"

export const metadata: Metadata = {
  title: "Addresses",
  description: "View your addresses",
}

export default async function Addresses(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const customer = await retrieveCustomer()
  const region = await getRegion(countryCode)
  const locale = getLocale((await cookies()).get("earmed-locale")?.value)

  if (!customer || !region) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="addresses-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">
          {locale === "fa" ? "آدرس‌ها" : "Shipping addresses"}
        </h1>
        <p className="text-base-regular">
          {locale === "fa"
            ? "آدرس‌های تحویل خود را اضافه، ویرایش یا حذف کنید. این آدرس‌ها هنگام پرداخت در دسترس خواهند بود."
            : "Add, edit, or remove delivery addresses. Saved addresses are available during checkout."}
        </p>
      </div>
      <AddressBook customer={customer} region={region} locale={locale} />
    </div>
  )
}
