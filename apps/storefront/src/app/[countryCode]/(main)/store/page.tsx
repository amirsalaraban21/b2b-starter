import { listCategories } from "@/lib/data/categories"
import { SortOptions } from "@/modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@/modules/store/templates"
import { Metadata } from "next"
import { isEarMedCategory } from "@/lib/category-localization"

export const dynamicParams = true

export const metadata: Metadata = {
  title: "EarMed Store",
  description: "Hearing aid batteries, cleaning, drying and care supplies.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    category?: string
    batterySize?: string
    availability?: "in-stock" | "out-of-stock"
    q?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const categories = await listCategories()

  const earMedCategories = categories.filter(isEarMedCategory)

  return (
    <StoreTemplate
      sortBy={searchParams.sortBy}
      page={searchParams.page}
      countryCode={params.countryCode}
      categories={earMedCategories}
      category={searchParams.category}
      batterySize={searchParams.batterySize}
      availability={searchParams.availability}
      query={searchParams.q}
    />
  )
}
