import { getInformationalContent } from "@/lib/content/informational-pages"
import { getLocale } from "@/lib/i18n"
import { getSiteConfig } from "@/lib/site-config"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import type { Metadata } from "next"
import { cookies } from "next/headers"

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocale((await cookies()).get("earmed-locale")?.value)
  const page = getInformationalContent(locale).about
  const site = getSiteConfig(locale)
  return { title: page.metadataTitle, description: page.metadataDescription, openGraph: { title: page.metadataTitle, description: page.metadataDescription, siteName: site.displayName } }
}

export default async function AboutPage() {
  const locale = getLocale((await cookies()).get("earmed-locale")?.value)
  const page = getInformationalContent(locale).about
  const fa = locale === "fa"

  return (
    <main dir={fa ? "rtl" : "ltr"} className="bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <section className="content-container py-12 small:py-16">
        <p className="text-sm font-bold text-teal-700 dark:text-teal-300">{page.eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-black leading-tight xsmall:text-4xl small:text-5xl">{page.title}</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300">{page.intro}</p>
      </section>

      <section className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="content-container grid gap-10 py-10 small:grid-cols-[1.15fr_.85fr] small:py-14">
          <div>
            <h2 className="text-2xl font-black">{page.scopeTitle}</h2>
            <p className="mt-4 max-w-2xl leading-8 text-slate-600 dark:text-slate-300">{page.scopeBody}</p>
            <LocalizedClientLink href="/store" className="mt-6 inline-flex bg-teal-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 motion-reduce:transition-none">
              {fa ? "مشاهده فروشگاه" : "Browse the store"}
            </LocalizedClientLink>
          </div>
          <div className="border-s border-slate-200 ps-6 dark:border-slate-700 small:ps-10">
            <h2 className="text-lg font-black">{page.categoriesTitle}</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {page.categories.map((category) => <li key={category} className="flex gap-3"><span aria-hidden className="mt-3 h-1.5 w-1.5 shrink-0 bg-teal-600" />{category}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="content-container grid gap-8 py-12 small:grid-cols-2 small:py-16">
        <div className="border-t-4 border-teal-600 bg-slate-900 p-6 text-white xsmall:p-8 dark:bg-slate-900">
          <h2 className="text-2xl font-black">{page.professionalTitle}</h2>
          <p className="mt-4 leading-8 text-slate-300">{page.professionalBody}</p>
          <LocalizedClientLink href="/professional" className="mt-6 inline-flex text-sm font-bold text-teal-300 underline-offset-4 hover:underline">{page.professionalAction}</LocalizedClientLink>
        </div>
        <div className="p-1 xsmall:p-4">
          <h2 className="text-2xl font-black">{page.approachTitle}</h2>
          <ol className="mt-5 space-y-4">
            {page.approachItems.map((item, index) => <li key={item} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 border-b border-slate-200 pb-4 text-sm leading-7 text-slate-600 last:border-0 dark:border-slate-800 dark:text-slate-300"><span className="font-black text-teal-700 dark:text-teal-300">{new Intl.NumberFormat(fa ? "fa-IR" : "en-US", { minimumIntegerDigits: 2 }).format(index + 1)}</span><span>{item}</span></li>)}
          </ol>
        </div>
      </section>
    </main>
  )
}
