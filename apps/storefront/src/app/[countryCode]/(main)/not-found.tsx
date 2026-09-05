import { getLocale } from "@/lib/i18n"
import NotFoundContent from "@/modules/layout/components/not-found-content"
import type { Metadata } from "next"
import { cookies } from "next/headers"

export const metadata: Metadata = {
  title: "404",
  robots: { index: false, follow: false },
}

export default async function NotFound() {
  const locale = getLocale((await cookies()).get("earmed-locale")?.value)
  return <NotFoundContent locale={locale} />
}
