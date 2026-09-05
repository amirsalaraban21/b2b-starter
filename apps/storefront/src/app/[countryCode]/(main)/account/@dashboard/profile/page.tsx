import { retrieveCustomer } from "@/lib/data/customer"
import { listRegions } from "@/lib/data/regions"
import ProfileCard from "@/modules/account/components/profile-card"
import SecurityCard from "@/modules/account/components/security-card"
import { Heading } from "@medusajs/ui"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import { getLocale } from "@/lib/i18n"

export const metadata: Metadata = {
  title: "Profile",
  description: "View and edit your EarMed Store profile.",
}

export default async function Profile() {
  const customer = await retrieveCustomer()
  const regions = await listRegions()
  const locale = getLocale((await cookies()).get("earmed-locale")?.value)

  if (!customer || !regions) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="profile-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <Heading level="h2" className="text-lg text-neutral-950">
          {locale === "fa" ? "اطلاعات حساب" : "Account details"}
        </Heading>
        <ProfileCard customer={customer} locale={locale} />
      </div>
      <div className="mb-8 flex flex-col gap-y-4">
        <Heading level="h2" className="text-lg text-neutral-950">
          {locale === "fa" ? "امنیت" : "Security"}
        </Heading>
        <SecurityCard customer={customer} />
      </div>
    </div>
  )
}

const Divider = () => {
  return <div className="w-full h-px bg-gray-200" />
}
