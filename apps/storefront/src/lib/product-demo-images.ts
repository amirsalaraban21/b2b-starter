const images = {
  battery10: "https://i0.wp.com/enablemart.in/wp-content/uploads/2024/03/Clip-on-for-plates-26.png?fit=3375%2C3375&ssl=1",
  battery13: "https://eshop-stamou.gr/image/cache/catalog/mpataries/signia_battery_13-1000x1000.jpg",
  battery312: "https://www.sellermax.de/shop/images/products/main/Si312-6.jpg",
  battery675: "https://batterydivision.com/cdn/shop/products/Signia-Hearing-aid-batteries-675-1_800x.jpg?v=1678792067",
  cleaningSpray: "https://www.cosmoear.gr/images/virtuemart/product/resized/sprau_katharismou_akoustikwn_varikoias_me_vourtsaki_30ml_audinell__1588000369_753.jpg",
  cleaningBrush: "https://www.elhearing.com/wp-content/uploads/2023/09/hearing-aid-brush-1.jpg",
  dryingCapsules: "https://silveraudition.ch/wp-content/uploads/2024/08/Pastilles-de-sechage2.png?_t=1737405310",
  dryingContainer: "https://www.signia-shop.no/cdn/shop/products/signia-hearing-aid-accessories-Drying-cup-Lang51-2000px-10943761.png?v=1659525421",
  waxGuard: "https://images-cdn.ubuy.co.in/633ac122e1528203c42b9889-ubuy-online-shopping.jpg",
  domesTubing: "https://d11qgm9a5k858y.cloudfront.net/n02lqudhd24q4zdgwfhxw4lys70y",
  storageCase: "https://media.s-bol.com/ZQBq2gJgP9rE/k5wlP56/1111x1200.jpg",
} as const

export const getDemoProductImage = (title?: string | null, fallback?: string | null) => {
  const value = (title || "").toLowerCase()

  if (value.includes("battery size 10")) return images.battery10
  if (value.includes("battery size 13")) return images.battery13
  if (value.includes("battery size 312")) return images.battery312
  if (value.includes("battery size 675")) return images.battery675
  if (value.includes("cleaning spray")) return images.cleaningSpray
  if (value.includes("cleaning brush") || value.includes("multi tool") || value.includes("cleaning wipes")) return images.cleaningBrush
  if (value.includes("drying capsules")) return images.dryingCapsules
  if (value.includes("drying container") || value.includes("drying care kit")) return images.dryingContainer
  if (value.includes("wax guard")) return images.waxGuard
  if (value.includes("domes") || value.includes("tubing")) return images.domesTubing
  if (value.includes("storage case")) return images.storageCase

  return fallback || undefined
}

export const departmentReferenceImages = [
  images.battery312,
  images.cleaningSpray,
  images.dryingContainer,
  images.waxGuard,
] as const
