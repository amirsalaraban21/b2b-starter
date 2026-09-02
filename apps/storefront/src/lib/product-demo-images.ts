const localAssortment = "/products/earmed/care-assortment-v2.png"
const localHero = "/products/earmed/hero-clinic-equipment.png"

export const getDemoProductImage = (
  title?: string | null,
  fallback?: string | null
) => {
  const value = (title || "").toLowerCase()

  if (
    value.includes("battery") ||
    value.includes("cleaning") ||
    value.includes("drying") ||
    value.includes("wax") ||
    value.includes("dome") ||
    value.includes("tubing") ||
    value.includes("storage case")
  ) {
    return localAssortment
  }

  if (fallback && !fallback.startsWith("http")) {
    return fallback
  }

  return localHero
}

export const departmentReferenceImages = [
  localAssortment,
  localAssortment,
  localAssortment,
  localAssortment,
] as const
