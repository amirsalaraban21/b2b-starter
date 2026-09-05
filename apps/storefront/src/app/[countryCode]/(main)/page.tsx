import StorefrontHome from "@/modules/home/components/storefront-home"
import { Metadata } from "next"
import { getLocale } from "@/lib/i18n"
import { getSiteConfig } from "@/lib/site-config"

export async function generateMetadata(props: {
  params: Promise<{ countryCode: string }>
}): Promise<Metadata> {
  const locale = getLocale((await props.params).countryCode === "ir" ? "fa" : "en")
  const site = getSiteConfig(locale)
  return { title: { absolute: site.metadataTitle }, description: site.metadataDescription }
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  return (
    <StorefrontHome countryCode={countryCode} />
  )
}
