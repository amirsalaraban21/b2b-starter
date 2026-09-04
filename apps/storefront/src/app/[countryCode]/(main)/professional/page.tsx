import ProfessionalApplicationForm from "@/modules/professional/components/application-form"
import { Metadata } from "next"
import { retrieveCustomer } from "@/lib/data/customer"
import { getLocale } from "@/lib/i18n"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getProfessionalApplication } from "@/lib/data/professional-application"

export const metadata: Metadata = {
  title: "Professional purchasing",
  description:
    "Professional purchasing information for doctors, audiologists and clinics.",
}

export default async function ProfessionalPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  const customer = await retrieveCustomer().catch(() => null)
  if (!customer)
    redirect(
      `/${countryCode}/account/login?return_to=/${countryCode}/professional`
    )
  const application = await getProfessionalApplication().catch(() => null)
  if (application && application.status !== "needs_information")
    redirect(`/${countryCode}/account/professional`)
  const locale = getLocale((await cookies()).get("earmed-locale")?.value)
  const fa = locale === "fa"
  return (
    <div
      dir={fa ? "rtl" : "ltr"}
      className="content-container py-10 small:py-16"
    >
      <p className="text-sm font-semibold text-teal-700">EarMed Professional</p>
      <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight">
        {fa
          ? "درخواست حساب حرفه‌ای EarMed"
          : "Apply for an EarMed professional account"}
      </h1>
      <p className="mt-5 max-w-2xl leading-7 text-ui-fg-subtle">
        {fa
          ? "همه کاربران ابتدا مشتری عادی هستند. دسترسی حرفه‌ای فقط پس از بررسی و تأیید مدیر فعال می‌شود."
          : "Every user starts as a regular customer. Professional access is enabled only after admin review and approval."}
      </p>
      <ProfessionalApplicationForm
        locale={locale}
        customer={customer}
        application={application}
      />
    </div>
  )
}
