import type { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

const CONFIRM_FLAG = "--confirm-starter-demo-cleanup"
const starterProducts = [
  { title: '16" Ultra-Slim AI Laptop | 3K OLED | 1.1cm Thin | 6-Speaker Audio', skus: ["256-BLUE", "512-RED"] },
  { title: "1080p HD Pro Webcam | Superior Video | Privacy enabled", skus: ["WEBCAM-BLACK", "WEBCAM-WHITE"] },
  { title: '6.5" Ultra HD Smartphone | 3x Impact-Resistant Screen', skus: ["PHONE-256-PURPLE", "PHONE-256-RED"] },
  { title: '34" QD-OLED Curved Gaming Monitor | Ultra-Wide | Infinite Contrast | 175Hz', skus: ["ACME-MONITOR-WHITE", "ACME-MONITOR-BLACK"] },
  { title: "Hi-Fi Gaming Headset | Pro-Grade DAC | Hi-Res Certified", skus: ["HEADPHONE-BLACK", "HEADPHONE-WHITE"] },
  { title: "Wireless Keyboard | Touch ID | Numeric Keypad", skus: ["KEYBOARD-BLACK", "KEYBOARD-WHITE"] },
  { title: "Wireless Rechargeable Mouse | Multi-Touch Surface", skus: ["MOUSE-BLACK", "MOUSE-WHITE"] },
  { title: "Conference Speaker | High-Performance | Budget-Friendly", skus: ["SPEAKER-BLACK", "SPEAKER-WHITE"] },
] as const

const sameValues = (actual: string[], expected: readonly string[]) => {
  const sortedExpected = [...expected].sort()
  return actual.length === expected.length && [...actual].sort().every((value, index) => value === sortedExpected[index])
}

export default async function cleanupStarterDemo({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const productService = container.resolve(Modules.PRODUCT) as any
  const products = await productService.listProducts(
    { title: starterProducts.map(({ title }) => title) },
    { take: 100, select: ["id", "title", "metadata"], relations: ["variants"] }
  )
  const candidates: any[] = []

  for (const expected of starterProducts) {
    const matches = products.filter((product: any) => product.title === expected.title)
    if (matches.length > 1) throw new Error(`Ambiguous starter identifier: ${expected.title} matched ${matches.length} products.`)
    if (!matches.length) {
      logger.info(`[starter-cleanup] Not present: ${expected.title}`)
      continue
    }
    const product = matches[0]
    const skus = (product.variants ?? []).map((variant: any) => variant.sku).filter(Boolean)
    if (product.metadata?.catalog_source || !sameValues(skus, expected.skus)) {
      throw new Error(`Refusing ambiguous candidate ${product.id}: metadata or SKU signature differs.`)
    }
    candidates.push(product)
  }

  logger.info(`[starter-cleanup] Candidates (${candidates.length}): ${candidates.map(({ id, title }) => `${id} (${title})`).join(", ") || "none"}`)
  if (!process.argv.includes(CONFIRM_FLAG)) {
    logger.info(`[starter-cleanup] Dry run only. Re-run with ${CONFIRM_FLAG} after reviewing every candidate.`)
    return
  }
  if (!candidates.length) {
    logger.info("[starter-cleanup] Nothing to delete.")
    return
  }
  await productService.deleteProducts(candidates.map(({ id }) => id))
  logger.info(`[starter-cleanup] Deleted ${candidates.length} verified original starter products.`)
}
