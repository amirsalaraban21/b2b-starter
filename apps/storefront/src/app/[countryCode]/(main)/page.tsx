import StorefrontHome from "@/modules/home/components/storefront-home"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Medusa Next.js Starter Template",
  description:
    "A performant frontend ecommerce starter template with Next.js 14 and Medusa.",
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
