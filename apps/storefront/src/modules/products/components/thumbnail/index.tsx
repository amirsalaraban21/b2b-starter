import { getDemoProductImage } from "@/lib/product-demo-images"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import React from "react"
import PlaceholderImage from "@/modules/common/icons/placeholder-image"

type ThumbnailProps = {
  thumbnail?: string | null
  images?: HttpTypes.StoreProductImage[] | null
  productTitle?: string | null
  size?: "small" | "medium" | "large" | "full" | "square"
  isFeatured?: boolean
  className?: string
  type?: "preview" | "full"
  "data-testid"?: string
}

const Thumbnail: React.FC<ThumbnailProps> = ({
  thumbnail,
  images,
  productTitle,
  size = "small",
  isFeatured,
  className,
  "data-testid": dataTestid,
  type,
}) => {
  const fallback = thumbnail || images?.[0]?.url
  const initialImage = getDemoProductImage(productTitle, fallback)

  return (
    <div
      className={clx("relative w-full overflow-hidden", className, {
        "aspect-[11/14]": isFeatured,
        "aspect-[9/16]": !isFeatured && size !== "square",
        "aspect-[1/1]": size === "square",
        "w-[180px]": size === "small",
        "w-[290px]": size === "medium",
        "w-[440px]": size === "large",
        "w-full": size === "full",
      })}
      data-testid={dataTestid}
    >
      {initialImage ? (
        <img
          src={initialImage}
          alt={productTitle || ""}
          className={clx("absolute inset-0 h-full w-full object-contain", {
            "p-4": type === "full",
            "p-2": type === "preview",
          })}
          draggable={false}
          loading={isFeatured ? "eager" : "lazy"}
        />
      ) : (
        <div className="absolute inset-0 flex h-full w-full items-center justify-center">
          <PlaceholderImage size={size === "small" ? 16 : 24} />
        </div>
      )}
    </div>
  )
}

export default Thumbnail
