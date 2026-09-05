import { getBaseURL } from "@/lib/util/env"
import { Toaster } from "@medusajs/ui"
import { Analytics } from "@vercel/analytics/next"
import { GeistSans } from "geist/font/sans"
import { Metadata } from "next"
import { cookies } from "next/headers"
import { getLocale, localeDirection } from "@/lib/i18n"
import { getSiteConfig } from "@/lib/site-config"
import "@/styles/globals.css"

const defaultSite = getSiteConfig("fa")

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: { default: defaultSite.metadataTitle, template: `%s | ${defaultSite.displayName}` },
  description: defaultSite.metadataDescription,
  openGraph: {
    type: "website",
    siteName: defaultSite.displayName,
    title: defaultSite.metadataTitle,
    description: defaultSite.metadataDescription,
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const locale = getLocale(cookieStore.get("earmed-locale")?.value)
  const theme = cookieStore.get("earmed-theme")?.value === "dark" ? "dark" : "light"
  return (
    <html lang={locale} dir={localeDirection[locale]} data-mode={theme} className={`${GeistSans.variable} ${theme === "dark" ? "dark" : ""}`} suppressHydrationWarning>
      <body>
        <main className="relative">{props.children}</main>
        <Toaster className="z-[99999]" position="bottom-left" />
        <Analytics />
      </body>
    </html>
  )
}
