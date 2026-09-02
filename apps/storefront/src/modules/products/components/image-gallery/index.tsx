"use client"

import { getDemoProductImage } from "@/lib/product-demo-images"
import { ArrowLeftMini, ArrowRightMini } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { clx, IconButton } from "@medusajs/ui"
import { useCallback, useEffect, useMemo, useState } from "react"

type ImageGalleryProps = {
  product: HttpTypes.StoreProduct
}

const ImageGallery = ({ product }: ImageGalleryProps) => {
  const realDemoImage = getDemoProductImage(product.title, product.thumbnail || product.images?.[0]?.url)
  const images = useMemo(() => {
    if (!realDemoImage) return product?.images || []
    return [{ id: "real-demo", url: realDemoImage } as HttpTypes.StoreProductImage]
  }, [product, realDemoImage])

  const [selectedImage, setSelectedImage] = useState<HttpTypes.StoreProductImage | undefined>(images[0])
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    setSelectedImage(images[0])
    setSelectedImageIndex(0)
  }, [images])

  const handleArrowClick = useCallback((direction: "left" | "right") => {
    if (!images.length) return
    const nextIndex = direction === "left" ? selectedImageIndex - 1 : selectedImageIndex + 1
    if (nextIndex < 0 || nextIndex >= images.length) return
    setSelectedImageIndex(nextIndex)
    setSelectedImage(images[nextIndex])
  }, [images, selectedImageIndex])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement instanceof HTMLInputElement) return
      if (e.key === "ArrowLeft") handleArrowClick("left")
      if (e.key === "ArrowRight") handleArrowClick("right")
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleArrowClick])

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 small:p-8">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-white">
        {selectedImage?.url && (
          <img src={selectedImage.url} alt={product.title || ""} className="absolute inset-0 h-full w-full object-contain p-8 small:p-12" />
        )}
      </div>
      {images.length > 1 && (
        <div className="flex w-full items-center justify-between">
          <div className="flex gap-2">
            <IconButton disabled={selectedImageIndex === 0} className="rounded-full" onClick={() => handleArrowClick("left")}><ArrowLeftMini /></IconButton>
            <IconButton disabled={selectedImageIndex === images.length - 1} className="rounded-full" onClick={() => handleArrowClick("right")}><ArrowRightMini /></IconButton>
          </div>
          <ul className="flex gap-2 overflow-x-auto">
            {images.map((image, index) => (
              <li key={image.id} onClick={() => { setSelectedImage(image); setSelectedImageIndex(index) }} role="button" className={clx("h-14 w-14 overflow-hidden rounded-lg border bg-white p-1", index === selectedImageIndex ? "border-teal-500" : "border-slate-200")}>
                <img src={image.url} alt="" className="h-full w-full object-contain" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default ImageGallery
