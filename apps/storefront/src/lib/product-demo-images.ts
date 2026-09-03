const assets = {
  battery: "/products/earmed/batteries-sheet.png",
  cleaning: "/products/earmed/cleaning-sheet.png",
  drying: "/products/earmed/drying-sheet.png",
  consumable: "/products/earmed/consumables-sheet.png",
  hero: "/products/earmed/care-assortment-v2.png",
} as const

export const departmentImageByKey = {
  battery: assets.battery,
  cleaning: assets.cleaning,
  drying: assets.drying,
  consumable: assets.consumable,
} as const

const titleValue = (title?: string | null) => (title || "").toLowerCase()

export const getDemoProductImage = (title?: string | null, fallback?: string | null) => {
  const value = titleValue(title)
  if (value.includes("battery")) return assets.battery
  if (value.includes("cleaning") || value.includes("brush") || value.includes("wipes") || value.includes("multi tool")) return assets.cleaning
  if (value.includes("drying")) return assets.drying
  if (value.includes("wax") || value.includes("dome") || value.includes("tubing") || value.includes("storage case")) return assets.consumable
  if (fallback && !fallback.startsWith("http") && !fallback.includes("/products/demo/")) return fallback
  return assets.hero
}

export const getDemoProductImageClass = (title?: string | null) => {
  const value = titleValue(title)
  const positions = [
    ["size 10", "start-0 top-0"], ["size 13", "end-0 top-0"], ["size 312", "start-0 bottom-0"], ["size 675", "end-0 bottom-0"],
    ["spray", "start-0 top-0"], ["wipes", "end-0 top-0"], ["brush", "start-0 bottom-0"], ["multi tool", "end-0 bottom-0"],
    ["capsules", "start-0 top-0"], ["container", "end-0 top-0"], ["care kit", "start-0 bottom-0"],
    ["wax", "start-0 top-0"], ["dome", "end-0 top-0"], ["tubing", "start-0 bottom-0"], ["storage case", "end-0 bottom-0"],
  ] as const
  return positions.find(([term]) => value.includes(term))?.[1]
}

export const departmentReferenceImages = [assets.battery, assets.cleaning, assets.drying, assets.consumable] as const
