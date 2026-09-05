import { getInformationalContent } from "@/lib/content/informational-pages"
import { getLocale } from "@/lib/i18n"
import { getSiteConfig } from "@/lib/site-config"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import type { Metadata } from "next"
import { cookies } from "next/headers"
import { getStorefrontContent } from "@/lib/data/storefront-content"

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocale((await cookies()).get("earmed-locale")?.value)
  const page = getInformationalContent(locale).contact
  const site = getSiteConfig(locale)
  return { title: page.metadataTitle, description: page.metadataDescription, openGraph: { title: page.metadataTitle, description: page.metadataDescription, siteName: site.displayName } }
}

export default async function ContactPage() {
  const locale = getLocale((await cookies()).get("earmed-locale")?.value)
  const fallback = getInformationalContent(locale).contact
  const cms = await getStorefrontContent("contact", locale)
  const page = cms ? { ...fallback, eyebrow: cms.eyebrow, title: cms.title, intro: cms.intro } : fallback
  const site = getSiteConfig(locale)
  const details = [
    { label: page.phone, value: cms ? cms.phone : site.supportPhone },
    { label: page.email, value: cms ? cms.email : site.supportEmail },
    { label: page.address, value: cms ? cms.address : site.contactAddress },
    { label: page.hours, value: cms ? cms.working_hours : site.workingHours },
  ].filter((item) => Boolean(item.value))

  return (
    <main dir={locale === "fa" ? "rtl" : "ltr"} className="bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <div className="content-container py-12 small:py-16">
        <p className="text-sm font-bold text-teal-700 dark:text-teal-300">{page.eyebrow}</p>
        <h1 className="mt-3 text-3xl font-black xsmall:text-4xl">{page.title}</h1>
        <p className="mt-5 max-w-2xl leading-8 text-slate-600 dark:text-slate-300">{page.intro}</p>

        <div className="mt-10 grid overflow-hidden border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 small:grid-cols-[1.1fr_.9fr]">
          <section className="p-6 xsmall:p-8 small:p-10">
            <h2 className="text-xl font-black">{page.detailsTitle}</h2>
            {details.length ? (
              <dl className="mt-6 divide-y divide-slate-200 dark:divide-slate-800">
                {details.map((item) => <div key={item.label} className="grid gap-1 py-4 xsmall:grid-cols-[9rem_minmax(0,1fr)]"><dt className="font-semibold text-slate-500 dark:text-slate-400">{item.label}</dt><dd className="break-words">{item.value}</dd></div>)}
              </dl>
            ) : (
              <p className="mt-5 border-s-4 border-amber-500 bg-amber-50 p-4 text-sm leading-7 text-amber-950 dark:bg-amber-950/40 dark:text-amber-100">{page.unavailable}</p>
            )}
            {(cms ? cms.additional_text : site.additionalContactText) && <p className="mt-5 leading-7 text-slate-600 dark:text-slate-300">{cms ? cms.additional_text : site.additionalContactText}</p>}
          </section>
          <aside className="border-t border-slate-200 bg-slate-100 p-6 dark:border-slate-800 dark:bg-slate-950/60 xsmall:p-8 small:border-s small:border-t-0 small:p-10">
            <h2 className="text-xl font-black">{page.noteTitle}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{page.note}</p>
            <LocalizedClientLink href="/account/orders" className="mt-6 inline-flex text-sm font-bold text-teal-700 underline-offset-4 hover:underline dark:text-teal-300">{locale === "fa" ? "مشاهده سفارش‌ها" : "View orders"}</LocalizedClientLink>
          </aside>
        </div>
      </div>
    </main>
  )
}
