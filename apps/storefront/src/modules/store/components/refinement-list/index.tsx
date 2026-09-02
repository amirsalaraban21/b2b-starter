"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import SortProducts, { SortOptions } from "./sort-products"
import SearchInResults from "./search-in-results"
import { HttpTypes } from "@medusajs/types"
import CategoryList from "./category-list"
import OptionsPicker from "./options-picker"

type RefinementListProps = {
  sortBy: SortOptions
  listName?: string
  "data-testid"?: string
  categories?: HttpTypes.StoreProductCategory[]
  currentCategory?: HttpTypes.StoreProductCategory
  productOptions?: HttpTypes.StoreProductOption[]
  hideOptionsPicker?: boolean
}

const RefinementList = ({ sortBy, listName, "data-testid": dataTestId, categories, currentCategory, productOptions, hideOptionsPicker }: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback((name: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set(name, value)
    params.delete("page")
    return params.toString()
  }, [searchParams])

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value)
    const nextUrl = query ? `${pathname}?${query}` : pathname
    const currentSearch = searchParams.toString()
    const currentUrl = currentSearch ? `${pathname}?${currentSearch}` : pathname
    if (nextUrl === currentUrl) return
    router.push(nextUrl)
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <SearchInResults listName={listName} />
        <div className="border-t border-slate-100"><SortProducts sortBy={sortBy} setQueryParams={setQueryParams} data-testid={dataTestId} /></div>
      </div>
      {categories && categories.length > 0 && <CategoryList categories={categories} currentCategory={currentCategory} />}
      {!hideOptionsPicker && productOptions && productOptions.length > 0 && <OptionsPicker options={productOptions} />}
    </div>
  )
}

export default RefinementList
