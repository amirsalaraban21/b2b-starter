import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import User from "@/modules/common/icons/user"
import { B2BCustomer } from "@/types/global"
import { cookies } from "next/headers"
import { getLocale } from "@/lib/i18n"

export default async function AccountButton({
  customer,
}: {
  customer: B2BCustomer | null
}) {
  const locale = getLocale((await cookies()).get("earmed-locale")?.value)
  const label = customer?.first_name || (locale === "fa" ? "ورود" : "Log in")

  return (
    <LocalizedClientLink
      className="inline-flex min-h-10 items-center gap-1.5 px-2 text-sm font-medium text-slate-600 transition hover:text-teal-700 dark:text-slate-300"
      href="/account"
    >
      <User />
      <span className="hidden small:inline-block">{label}</span>
    </LocalizedClientLink>
  )
}
