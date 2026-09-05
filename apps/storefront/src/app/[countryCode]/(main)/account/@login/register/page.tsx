import { getLocale } from "@/lib/i18n"
import Register from "@/modules/account/components/register"
import AuthTemplate from "@/modules/account/templates/auth-template"
import { Metadata } from "next"
import { cookies } from "next/headers"

export const metadata: Metadata = { title: "Register" }
const safeReturn = (value?: string) => value?.startsWith("/") && !value.startsWith("//") && !value.includes("\\") ? value : undefined
export default async function RegisterPage({ params, searchParams }: { params: Promise<{ countryCode: string }>; searchParams: Promise<{ return_to?: string }> }) {
  const [{ countryCode }, query, cookieStore] = await Promise.all([params, searchParams, cookies()])
  const locale = getLocale(cookieStore.get("earmed-locale")?.value)
  return <AuthTemplate locale={locale}><Register locale={locale} countryCode={countryCode} returnTo={safeReturn(query.return_to)} /></AuthTemplate>
}
