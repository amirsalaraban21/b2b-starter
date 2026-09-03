"use client"

import { Locale } from "@/lib/i18n"
import { getDemoProductImage, getDemoProductImageClass } from "@/lib/product-demo-images"
import { getLocalizedProductTitle } from "@/lib/product-localization"
import { ArrowLeftMini, ArrowRightMini } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { IconButton } from "@medusajs/ui"
import { useMemo, useState } from "react"

type GalleryImage = { id: string; url: string; mapped: boolean }

const cropStyle = (crop?: string) => ({
  left: crop?.includes("end-0") ? "-100%" : "0",
  top: crop?.includes("bottom-0") ? "-100%" : "0",
})

export default function ImageGallery({ product, locale }: { product: HttpTypes.StoreProduct; locale: Locale }) {
  const mappedImage = getDemoProductImage(product.title, product.thumbnail || product.images?.[0]?.url)
  const crop = getDemoProductImageClass(product.title)
  const images = useMemo<GalleryImage[]>(() => {
    const result: GalleryImage[] = []
    if (mappedImage) result.push({ id: "earmed-product", url: mappedImage, mapped: true })
    for (const image of product.images || []) {
      if (!image.url || image.url === mappedImage || image.url.includes("/products/demo/")) continue
      if (!result.some((item) => item.url === image.url)) result.push({ id: image.id, url: image.url, mapped: false })
    }
    return result
  }, [mappedImage, product.images])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selected = images[selectedIndex] || images[0]
  const fa = locale === "fa"
  const localizedTitle = getLocalizedProductTitle(product, locale)

  const select = (index: number) => setSelectedIndex(Math.max(0, Math.min(index, images.length - 1)))

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="group relative aspect-square w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[inset_0_0_0_1px_rgba(15,23,42,0.015)] dark:border-slate-700 dark:bg-slate-950">
        {selected?.url ? (
          <img src={selected.url} alt={localizedTitle || ""} style={selected.mapped && crop ? cropStyle(crop) : undefined} className={`${selected.mapped && crop ? "absolute h-[200%] w-[200%] max-w-none" : "absolute inset-0 h-full w-full"} object-contain p-6 transition-transform duration-300 group-hover:scale-[1.025] motion-reduce:transform-none motion-reduce:transition-none small:p-8`} draggable={false} />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">{fa ? "تصویری موجود نیست" : "No image available"}</div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-2" dir="ltr">
            <IconButton aria-label={fa ? "تصویر قبلی" : "Previous image"} disabled={selectedIndex === 0} className="rounded-full border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900" onClick={() => select(selectedIndex - 1)}><ArrowLeftMini /></IconButton>
            <IconButton aria-label={fa ? "تصویر بعدی" : "Next image"} disabled={selectedIndex === images.length - 1} className="rounded-full border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900" onClick={() => select(selectedIndex + 1)}><ArrowRightMini /></IconButton>
          </div>
          <ul className="flex min-w-0 gap-2 overflow-x-auto py-1">
            {images.map((image, index) => (
              <li key={image.id}>
                <button type="button" onClick={() => select(index)} aria-label={`${fa ? "نمایش تصویر" : "Show image"} ${index + 1}`} aria-pressed={index === selectedIndex} className={`relative h-16 w-16 overflow-hidden rounded-lg border bg-white p-1 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 dark:bg-slate-900 ${index === selectedIndex ? "border-teal-600 ring-2 ring-teal-600/15" : "border-slate-200 hover:border-slate-400 dark:border-slate-700"}`}>
                  <img src={image.url} alt="" style={image.mapped && crop ? cropStyle(crop) : undefined} className={`${image.mapped && crop ? "absolute h-[200%] w-[200%] max-w-none" : "absolute inset-0 h-full w-full"} object-contain p-1`} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
