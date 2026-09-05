import { getInformationalContent } from "@/lib/content/informational-pages"
import { getLocale } from "@/lib/i18n"
import { getSiteConfig } from "@/lib/site-config"
import type { Metadata } from "next"
import { cookies } from "next/headers"
import { getStorefrontContent } from "@/lib/data/storefront-content"

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocale((await cookies()).get("earmed-locale")?.value)
  const page = getInformationalContent(locale).faq
  const site = getSiteConfig(locale)
  return { title: page.metadataTitle, description: page.metadataDescription, openGraph: { title: page.metadataTitle, description: page.metadataDescription, siteName: site.displayName } }
}

export default async function FAQPage() {
  const locale = getLocale((await cookies()).get("earmed-locale")?.value)
  const fallback = getInformationalContent(locale).faq
  const cms = await getStorefrontContent("faq", locale)
  const page = cms ? { ...fallback, eyebrow: cms.eyebrow, title: cms.title, intro: cms.intro } : fallback
  const items = cms?.items.map((item) => [item.question, item.answer, item.id] as const)
    || fallback.items.map(([question, answer]) => [question, answer, question] as const)

  return (
    <main dir={locale === "fa" ? "rtl" : "ltr"} className="bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <div className="content-container py-12 small:py-16">
        <div className="max-w-3xl">
          <p className="text-sm font-bold text-teal-700 dark:text-teal-300">{page.eyebrow}</p>
          <h1 className="mt-3 text-3xl font-black xsmall:text-4xl">{page.title}</h1>
          <p className="mt-5 leading-8 text-slate-600 dark:text-slate-300">{page.intro}</p>
        </div>
        <section className="mt-10 max-w-4xl divide-y divide-slate-200 border-y border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
          {items.map(([question, answer, id]) => (
            <details key={id} className="group px-5 open:bg-slate-50 dark:open:bg-slate-950/50 xsmall:px-7">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 [&::-webkit-details-marker]:hidden">
                <span className="min-w-0 break-words">{question}</span>
                <span aria-hidden className="shrink-0 text-xl font-normal text-teal-700 transition-transform duration-200 group-open:rotate-45 dark:text-teal-300 motion-reduce:transition-none">+</span>
              </summary>
              <p className="max-w-3xl pb-5 text-sm leading-7 text-slate-600 dark:text-slate-300">{answer}</p>
            </details>
          ))}
        </section>
      </div>
    </main>
  )
}
