"use client"

import { useCart } from "@/lib/context/cart-context"
import { Locale } from "@/lib/i18n"
import { getLocalizedProductTitle } from "@/lib/product-localization"
import { convertToLocale } from "@/lib/util/money"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import Spinner from "@/modules/common/icons/spinner"
import Thumbnail from "@/modules/products/components/thumbnail"
import { HttpTypes } from "@medusajs/types"
import { useState } from "react"

type Props = { item: HttpTypes.StoreCartLineItem; currencyCode: string; locale: Locale; disabled?: boolean }
const isGenericOption = (value?: string | null) => !value || /^(default|default variant|پیش.?فرض)$/i.test(value.trim())

const CartDrawerItem = ({ item, currencyCode, locale, disabled }: Props) => {
  const { handleDeleteItem, handleUpdateCartQuantity } = useCart()
  const [pendingAction, setPendingAction] = useState<"quantity" | "remove" | null>(null)
  const fa = locale === "fa"
  const product = item.product
  const title = product ? getLocalizedProductTitle(product, locale) : item.product_title || item.title
  const maxQuantity = item.variant?.manage_inventory && !item.variant.allow_backorder
    ? item.variant.inventory_quantity ?? undefined
    : undefined
  const busy = Boolean(disabled || pendingAction)
  const specifications = product?.metadata?.specifications
  const batterySize = specifications && typeof specifications === "object" && !Array.isArray(specifications) ? (specifications as Record<string, unknown>).battery_size : undefined
  const options = (item.variant?.options || []).map((option) => option.value).filter((value): value is string => !isGenericOption(value))
  const meaningfulOptions = batterySize ? [fa ? `سایز ${Number(batterySize).toLocaleString("fa-IR", { useGrouping: false })}` : `Size ${batterySize}`] : options
  const updateQuantity = async (quantity: number) => { if (busy || quantity < 1 || (maxQuantity !== undefined && quantity > maxQuantity)) return; setPendingAction("quantity"); try { await handleUpdateCartQuantity(item.id, quantity) } finally { setPendingAction(null) } }
  const remove = async () => { if (busy) return; setPendingAction("remove"); try { await handleDeleteItem(item.id) } finally { setPendingAction(null) } }
  const unitPrice = convertToLocale({ amount: item.unit_price, currency_code: currencyCode, locale: fa ? "fa-IR" : "en-US" })

  return (
    <article className="grid grid-cols-[88px_minmax(0,1fr)] gap-3.5">
      <LocalizedClientLink href={`/products/${item.product_handle || product?.handle}`} className="group relative h-[88px] overflow-hidden rounded-xl border border-slate-200 bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 dark:border-slate-700 dark:bg-slate-900"><Thumbnail thumbnail={item.thumbnail} images={product?.images} productTitle={product?.title || item.product_title} size="square" type="preview" className="h-full transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none" /></LocalizedClientLink>
      <div className="min-w-0">
        <div className="flex min-w-0 flex-col items-start gap-1 xsmall:flex-row xsmall:justify-between xsmall:gap-3"><div className="min-w-0"><LocalizedClientLink href={`/products/${item.product_handle || product?.handle}`} className="line-clamp-2 break-words text-sm font-bold leading-6 text-slate-950 transition-colors hover:text-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 dark:text-white dark:hover:text-teal-300 motion-reduce:transition-none">{title}</LocalizedClientLink>{meaningfulOptions.length > 0 && <p className="mt-0.5 break-words text-xs text-slate-500 dark:text-slate-400">{meaningfulOptions.join(" · ")}</p>}</div><span className="max-w-full break-words text-sm font-bold text-slate-950 dark:text-white xsmall:shrink-0">{unitPrice}</span></div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="inline-flex h-9 items-center overflow-hidden rounded-full border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-950" dir="ltr">
            <button type="button" onClick={() => updateQuantity(item.quantity - 1)} disabled={busy || item.quantity <= 1} aria-label={fa ? "کاهش تعداد" : "Decrease quantity"} className="grid h-full w-9 place-items-center text-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600 disabled:cursor-not-allowed disabled:opacity-35 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white motion-reduce:transition-none">−</button>
            <span className="grid h-full min-w-9 place-items-center border-x border-slate-200 px-1 text-xs font-bold text-slate-950 dark:border-slate-700 dark:text-white" aria-live="polite">{pendingAction === "quantity" ? <Spinner size="14" /> : fa ? item.quantity.toLocaleString("fa-IR") : item.quantity}</span>
            <button type="button" onClick={() => updateQuantity(item.quantity + 1)} disabled={busy || (maxQuantity !== undefined && item.quantity >= maxQuantity)} aria-label={fa ? "افزایش تعداد" : "Increase quantity"} className="grid h-full w-9 place-items-center text-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600 disabled:cursor-not-allowed disabled:opacity-35 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white motion-reduce:transition-none">+</button>
          </div>
          <button type="button" onClick={remove} disabled={busy} aria-label={fa ? `حذف ${title}` : `Remove ${title}`} className="min-h-9 rounded-md px-2 text-xs font-semibold text-slate-500 underline-offset-4 transition-colors hover:text-red-600 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:text-red-400 motion-reduce:transition-none">{pendingAction === "remove" ? <Spinner size="14" /> : fa ? "حذف" : "Remove"}</button>
        </div>
      </div>
    </article>
  )
}

export default CartDrawerItem
