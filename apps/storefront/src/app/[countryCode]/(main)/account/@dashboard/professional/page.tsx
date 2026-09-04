import { getProfessionalApplication } from "@/lib/data/professional-application"
import { getLocale } from "@/lib/i18n"
import ProfessionalStatus from "@/modules/account/components/professional-status"
import { cookies } from "next/headers"

export default async function ProfessionalAccountPage() {
  const locale = getLocale((await cookies()).get("earmed-locale")?.value)
  const application = await getProfessionalApplication().catch(() => null)
  return (
    <div>
      <h1 className="mb-5 text-2xl font-black">
        {locale === "fa" ? "وضعیت حساب حرفه‌ای" : "Professional account status"}
      </h1>
      <ProfessionalStatus locale={locale} application={application} />
    </div>
  )
}
