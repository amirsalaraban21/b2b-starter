import { listCategories } from "@/lib/data/categories"
import { SortOptions } from "@/modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@/modules/store/templates"
import { Metadata } from "next"

export const dynamicParams = true

export const metadata: Metadata = {
  title: "EarMed Store",
  description: "Hearing aid batteries, cleaning, drying and care supplies.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const categories = await listCategories()

  const earMedCategories = categories.filter((category) => {
    const name = category.name?.toLowerCase() || ""
    return (
      name.includes("hearing aid") ||
      name.includes("battery") ||
      name.includes("clean") ||
      name.includes("dry") ||
      name.includes("consumable") ||
      name.includes("parts") ||
      name.includes("accessor")
    )
  })

  return (
    <StoreTemplate
      sortBy={searchParams.sortBy}
      page={searchParams.page}
      countryCode={params.countryCode}
      categories={earMedCategories}
    />
  )
}
