import { MedusaContainer } from "@medusajs/framework"
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createProductCategoriesWorkflow,
  createProductsWorkflow,
} from "@medusajs/medusa/core-flows"

const source = "earmed_core"
const demoVersion = "v2"

const toHandle = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

const categories = [
  ["Hearing Aid Batteries", "باتری سمعک"],
  ["Cleaning & Care", "تمیزکاری و نگهداری"],
  ["Drying & Moisture Control", "خشک‌کن و رطوبت‌گیر"],
  ["Hearing Aid Consumables", "قطعات مصرفی سمعک"],
  ["Care & Accessories", "مراقبت و لوازم جانبی"],
] as const

const products = [
  [
    "Hearing Aid Battery Size 10",
    "باتری سمعک سایز ۱۰",
    0,
    "Zinc-air hearing aid battery in size 10.",
    "/products/demo/consumable.svg",
    1800000,
    { battery_size: "10", color_code: "yellow" },
  ],
  [
    "Hearing Aid Battery Size 13",
    "باتری سمعک سایز ۱۳",
    0,
    "Zinc-air hearing aid battery in size 13.",
    "/products/demo/consumable.svg",
    1900000,
    { battery_size: "13", color_code: "orange" },
  ],
  [
    "Hearing Aid Battery Size 312",
    "باتری سمعک سایز ۳۱۲",
    0,
    "Zinc-air hearing aid battery in size 312.",
    "/products/demo/consumable.svg",
    1900000,
    { battery_size: "312", color_code: "brown" },
  ],
  [
    "Hearing Aid Battery Size 675",
    "باتری سمعک سایز ۶۷۵",
    0,
    "Zinc-air hearing aid battery in size 675.",
    "/products/demo/consumable.svg",
    2100000,
    { battery_size: "675", color_code: "blue" },
  ],
  [
    "Hearing Aid Cleaning Spray",
    "اسپری تمیزکننده سمعک",
    1,
    "Cleaning spray for routine external hearing aid care.",
    "/products/demo/accessory.svg",
    3200000,
    {},
  ],
  [
    "Hearing Aid Cleaning Wipes",
    "دستمال تمیزکننده سمعک",
    1,
    "Cleaning wipes for routine external hearing aid care.",
    "/products/demo/consumable.svg",
    2800000,
    {},
  ],
  [
    "Hearing Aid Cleaning Brush",
    "برس تمیزکننده سمعک",
    1,
    "Small brush for routine cleaning of hearing aid surfaces and openings.",
    "/products/demo/accessory.svg",
    1400000,
    {},
  ],
  [
    "Hearing Aid Cleaning Multi Tool",
    "ابزار چندکاره تمیزکردن سمعک",
    1,
    "Compact multi-purpose tool for routine hearing aid cleaning.",
    "/products/demo/accessory.svg",
    2200000,
    {},
  ],
  [
    "Hearing Aid Drying Capsules",
    "کپسول رطوبت‌گیر سمعک",
    2,
    "Moisture-control capsules intended for compatible drying containers.",
    "/products/demo/consumable.svg",
    2500000,
    {},
  ],
  [
    "Hearing Aid Drying Container",
    "ظرف خشک‌کن سمعک",
    2,
    "Simple storage container for passive hearing aid drying routines.",
    "/products/demo/accessory.svg",
    3000000,
    {},
  ],
  [
    "Hearing Aid Drying Care Kit",
    "کیت خشک‌کن و مراقبت سمعک",
    2,
    "Basic care kit for routine moisture control and storage.",
    "/products/demo/accessory.svg",
    5200000,
    {},
  ],
  [
    "Hearing Aid Wax Guard Filters",
    "فیلتر جرم‌گیر سمعک",
    3,
    "Replacement wax guard filters for compatible hearing aid systems.",
    "/products/demo/consumable.svg",
    2600000,
    { compatibility: "model dependent" },
  ],
  [
    "Hearing Aid Domes",
    "دام سمعک",
    3,
    "Replacement domes for compatible receiver and thin-tube hearing aids.",
    "/products/demo/consumable.svg",
    2400000,
    { compatibility: "model dependent" },
  ],
  [
    "Hearing Aid Tubing",
    "تیوب سمعک",
    3,
    "Replacement tubing for compatible earmold and hearing aid fittings.",
    "/products/demo/consumable.svg",
    2000000,
    { compatibility: "model dependent" },
  ],
  [
    "Hearing Aid Storage Case",
    "کیف نگهداری سمعک",
    4,
    "Compact case for storing hearing aids and small care accessories.",
    "/products/demo/accessory.svg",
    3500000,
    {},
  ],
] as const

export default async function seedEarMedDemo({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const productService = container.resolve(Modules.PRODUCT)
  const salesChannelService = container.resolve(Modules.SALES_CHANNEL)

  const channels = await salesChannelService.listSalesChannels({})
  const channel = channels[0]

  if (!channel) {
    throw new Error(
      "No sales channel exists. Configure a Medusa sales channel before seeding."
    )
  }

  const existingCategories = await productService.listProductCategories(
    {},
    { take: 1000, select: ["id", "name", "handle"] }
  )

  const missingCategories = categories.filter(
    ([name]) =>
      !existingCategories.some(
        (category: { name: string; handle?: string | null }) =>
          category.name === name || category.handle === toHandle(name)
      )
  )

  if (missingCategories.length) {
    await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: missingCategories.map(([name, faName]) => ({
          name,
          is_active: true,
          metadata: {
            catalog_source: source,
            demo_version: demoVersion,
            fa_name: faName,
          },
        })),
      },
    })
  }

  const allCategories = await productService.listProductCategories(
    {},
    { take: 1000, select: ["id", "name", "handle"] }
  )

  const existingProducts = await productService.listProducts(
    {},
    { take: 1000, select: ["id", "title", "metadata"] }
  )

  const missingProducts = products.filter(
    ([title]) =>
      !existingProducts.some(
        (product: {
          title: string
          metadata?: Record<string, unknown> | null
        }) =>
          product.title === title && product.metadata?.catalog_source === source
      )
  )

  if (missingProducts.length) {
    await createProductsWorkflow(container).run({
      input: {
        products: missingProducts.map(
          ([title, faTitle, categoryIndex, description, image, amount, specs]) => ({
            title,
            description,
            status: ProductStatus.PUBLISHED,
            category_ids: [
              allCategories.find(
                (category: { name: string; handle?: string | null }) =>
                  category.name === categories[categoryIndex][0] ||
                  category.handle === toHandle(categories[categoryIndex][0])
              )!.id,
            ],
            images: [{ url: image }],
            metadata: {
              catalog_source: source,
              demo_version: demoVersion,
              fa_title: faTitle,
              fa_short_description: description,
              price_status: "demo",
              specifications: specs,
            },
            options: [{ title: "Default", values: ["Default"] }],
            variants: [
              {
                title: "Default",
                options: { Default: "Default" },
                sku: `EARMED-CORE-${title
                  .replace(/[^A-Za-z0-9]/g, "-")
                  .toUpperCase()}`,
                manage_inventory: false,
                prices: [{ currency_code: "irr", amount }],
              },
            ],
            sales_channels: [{ id: channel.id }],
          })
        ),
      },
    })
  }

  logger.info(
    `EarMed core catalog ready: ${products.length} products on sales channel ${channel.id}`
  )
}
