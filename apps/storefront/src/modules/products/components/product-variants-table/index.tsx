"use client"

import { addToCartEventBus } from "@/lib/data/cart-event-bus"
import { Locale } from "@/lib/i18n"
import { getProductPrice } from "@/lib/util/get-product-price"
import Button from "@/modules/common/components/button"
import ShoppingBag from "@/modules/common/icons/shopping-bag"
import { HttpTypes } from "@medusajs/types"
import { useState } from "react"

const batteryColors: Record<string, { fa: string; en: string; tone: string }> = {
  "10": { fa: "زرد", en: "Yellow", tone: "bg-yellow-400" },
  "13": { fa: "نارنجی", en: "Orange", tone: "bg-orange-500" },
  "312": { fa: "قهوه‌ای", en: "Brown", tone: "bg-amber-800" },
  "675": { fa: "آبی", en: "Blue", tone: "bg-blue-600" },
}

const isAvailable = (variant?: HttpTypes.StoreProductVariant) => Boolean(
  variant && (variant.allow_backorder || !variant.manage_inventory || (variant.inventory_quantity || 0) > 0)
)

export default function ProductVariantsTable({ product, region, locale }: { product: HttpTypes.StoreProduct; region: HttpTypes.StoreRegion; locale: Locale }) {
  const variants = product.variants || []
  const [variantId, setVariantId] = useState(variants[0]?.id)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const fa = locale === "fa"
  const selectedVariant = variants.find((variant) => variant.id === variantId) || variants[0]
  const available = isAvailable(selectedVariant)
  const hasMeaningfulVariants = variants.length > 1
  const maxQuantity = selectedVariant?.manage_inventory && !selectedVariant.allow_backorder
    ? Math.max(selectedVariant.inventory_quantity || 0, 1)
    : undefined

  const variantLabels = variants.map((variant) => {
    const values = (variant.options || []).map((option) => option.value).filter((value) => value && !/^default/i.test(value))
    const base = values.length ? values.join(" / ") : variant.title || variant.sku || "Variant"
    const battery = batteryColors[base]
    return { variant, base, battery }
  })

  const changeQuantity = (next: number) => {
    setQuantity(Math.min(Math.max(1, next), maxQuantity || Number.MAX_SAFE_INTEGER))
  }

  const handleAddToCart = () => {
    if (!selectedVariant || !available) return
    setIsAdding(true)
    addToCartEventBus.emitCartAdd({
      lineItems: [{ productVariant: { ...selectedVariant, product }, quantity }],
      regionId: region.id,
    })
    setIsAdding(false)
  }

  return (
    <div className="mt-5 border-t border-slate-200 pt-5 dark:border-slate-700">
      {hasMeaningfulVariants && (
        <fieldset className="mb-5">
          <legend className="mb-3 text-sm font-bold text-slate-800 dark:text-slate-100">{fa ? "انتخاب گزینه" : "Choose an option"}</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {variantLabels.map(({ variant, base, battery }) => {
              const active = variant.id === selectedVariant?.id
              const variantPrice = getProductPrice({ product, variantId: variant.id, locale: fa ? "fa-IR" : "en-US" }).variantPrice
              return (
                <button key={variant.id} type="button" disabled={!isAvailable(variant)} aria-pressed={active} onClick={() => { setVariantId(variant.id); setQuantity(1) }} className={`min-h-12 rounded-lg border px-3 py-2 text-start text-sm transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none ${active ? "border-teal-700 bg-teal-50 text-teal-950 shadow-sm dark:border-teal-500 dark:bg-teal-950/50 dark:text-teal-50" : "border-slate-200 bg-white hover:border-teal-400 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-teal-600"}`}>
                  <span className="flex items-center gap-2 font-bold">{battery && <span className={`h-3 w-3 rounded-full border border-black/10 ${battery.tone}`} />}{fa && battery ? `${Number(base).toLocaleString("fa-IR", { useGrouping: false })} — ${battery.fa}` : battery ? `${base} — ${battery.en}` : base}</span>
                  {variantPrice && <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{variantPrice.calculated_price}</span>}
                </button>
              )
            })}
          </div>
        </fieldset>
      )}

      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{fa ? "وضعیت" : "Availability"}</p>
          <p className={`mt-1 flex items-center gap-2 text-sm font-bold ${available ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"}`}><span className="h-2 w-2 rounded-full bg-current" />{available ? (fa ? "موجود" : "In stock") : (fa ? "ناموجود" : "Unavailable")}</p>
        </div>
        <div>
          <p className="mb-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{fa ? "تعداد" : "Quantity"}</p>
          <div className="flex h-11 items-center overflow-hidden rounded-lg border border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900">
            <button type="button" onClick={() => changeQuantity(quantity - 1)} disabled={quantity <= 1} aria-label={fa ? "کاهش تعداد" : "Decrease quantity"} className="h-full min-w-11 text-lg transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-teal-700 dark:hover:bg-slate-800">−</button>
            <output aria-live="polite" className="min-w-10 text-center text-sm font-bold">{fa ? quantity.toLocaleString("fa-IR") : quantity}</output>
            <button type="button" onClick={() => changeQuantity(quantity + 1)} disabled={Boolean(maxQuantity && quantity >= maxQuantity)} aria-label={fa ? "افزایش تعداد" : "Increase quantity"} className="h-full min-w-11 text-lg transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-teal-700 dark:hover:bg-slate-800">+</button>
          </div>
        </div>
      </div>

      <Button onClick={handleAddToCart} variant="primary" className="h-12 w-full rounded-lg text-base font-bold transition duration-200 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 motion-reduce:transition-none" isLoading={isAdding} disabled={!selectedVariant || !available} data-testid="add-product-button">
        <ShoppingBag className="text-white" fill={available ? "#fff" : "none"} />
        {!selectedVariant ? (fa ? "گزینه‌ای انتخاب کنید" : "Choose an option") : !available ? (fa ? "ناموجود" : "Unavailable") : (fa ? "افزودن به سبد خرید" : "Add to cart")}
      </Button>
    </div>
  )
}
