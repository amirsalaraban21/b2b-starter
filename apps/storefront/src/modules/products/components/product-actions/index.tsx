"use client"

import { HttpTypes } from "@medusajs/types"
import ProductPrice from "../product-price"
import ProductVariantsTable from "../product-variants-table"
import { Locale } from "@/lib/i18n"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  locale: Locale
}

export default function ProductActions({
  product,
  region,
  locale,
}: ProductActionsProps) {
  return (
    <>
      <div className="flex flex-col gap-y-2 w-full">
        <ProductPrice product={product} locale={locale} />
        <ProductVariantsTable product={product} region={region} locale={locale} />
      </div>
    </>
  )
}
