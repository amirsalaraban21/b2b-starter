"use server"

import { sdk } from "@/lib/config"
import { getAuthHeaders, getCacheOptions } from "@/lib/data/cookies"
import { getRegion } from "@/lib/data/regions"
import { sortProducts } from "@/lib/util/sort-products"
import { SortOptions } from "@/modules/store/components/refinement-list/sort-products"
import { HttpTypes } from "@medusajs/types"

const isEarMedProduct = (product?: HttpTypes.StoreProduct | null) =>
  product?.metadata?.catalog_source === "earmed_core"

export const getProductsById = async ({
  ids,
  regionId,
}: {
  ids: string[]
  regionId: string
}) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("products")),
  }

  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[] }>(`/store/products`, {
      credentials: "include",
      method: "GET",
      query: {
        id: ids,
        region_id: regionId,
        fields:
          "*variants,*variants.calculated_price,*variants.inventory_quantity,+metadata",
      },
      headers,
      next,
    })
    .then(({ products }) => products.filter(isEarMedProduct))
}

export const getProductByHandle = async (handle: string, regionId: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("products")),
  }

  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[] }>(`/store/products`, {
      credentials: "include",
      method: "GET",
      query: {
        handle,
        region_id: regionId,
        fields:
          "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags",
      },
      headers,
      next,
    })
    .then(({ products }) => products.find(isEarMedProduct))
}

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  countryCode: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = (_pageParam - 1) * limit
  const region = await getRegion(countryCode)

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("products")),
  }

  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
      `/store/products`,
      {
        credentials: "include",
        method: "GET",
        query: {
          limit,
          offset,
          region_id: region.id,
          fields: "*variants.calculated_price,*variants.options,+metadata",
          ...queryParams,
        },
        headers,
        next,
      }
    )
    .then(({ products }) => {
      const earMedProducts = products.filter(isEarMedProduct)
      const nextPage = earMedProducts.length === limit ? pageParam + 1 : null

      return {
        response: {
          products: earMedProducts,
          count: earMedProducts.length,
        },
        nextPage,
        queryParams,
      }
    })
}

/**
 * This will fetch 100 products to the Next.js cache and sort them based on the sortBy parameter.
 * It will then return the paginated products based on the page and limit parameters.
 */
export const listProductsWithSort = async ({
  page = 0,
  queryParams,
  sortBy = "created_at",
  countryCode,
  optionValueIds,
}: {
  page?: number
  queryParams?: HttpTypes.FindParams &
    HttpTypes.StoreProductParams & { option_value_id?: string | string[] }
  sortBy?: SortOptions
  countryCode: string
  optionValueIds?: string[]
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  const limit = queryParams?.limit || 12

  const dedupedOptionValueIds = optionValueIds?.length
    ? Array.from(new Set(optionValueIds))
    : undefined

  const {
    response: { products },
  } = await listProducts({
    pageParam: 0,
    queryParams: {
      ...queryParams,
      ...(dedupedOptionValueIds
        ? { option_value_id: dedupedOptionValueIds }
        : {}),
      limit: 100,
    },
    countryCode,
  })

  const sortedProducts = sortProducts(products, sortBy)
  const effectiveCount = sortedProducts.length
  const pageParam = (page - 1) * limit
  const nextPage =
    effectiveCount > pageParam + limit ? pageParam + limit : null
  const paginatedProducts = sortedProducts.slice(pageParam, pageParam + limit)

  return {
    response: {
      products: paginatedProducts,
      count: effectiveCount,
    },
    nextPage,
    queryParams,
  }
}
