import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules, ProductStatus } from "@medusajs/framework/utils"
import { createProductCategoriesWorkflow, createProductsWorkflow } from "@medusajs/medusa/core-flows"

const source = "earmed_demo"
const toHandle = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
const categories = [
  ["Ear Examination Equipment", "تجهیزات معاینه گوش"], ["Audiology Equipment", "تجهیزات ادیولوژی"], ["Clinical Equipment", "تجهیزات کلینیکی"], ["Consumables", "لوازم مصرفی"], ["Parts & Accessories", "قطعات و لوازم جانبی"],
] as const
const products = [
  ["Diagnostic Otoscope","اتوسکوپ تشخیصی",0,"A general ear examination instrument.","/products/demo/examination.svg",120000000], ["LED Otoscope","اتوسکوپ LED",0,"An otoscope with an LED light source.","/products/demo/examination.svg",150000000], ["Pneumatic Otoscope Set","مجموعه اتوسکوپ پنوماتیک",0,"A set for general ear examination use.","/products/demo/examination.svg",280000000], ["Ear Examination Light","چراغ معاینه گوش",0,"A compact light for examination settings.","/products/demo/examination.svg",70000000],
  ["Audiometer Headphone","هدفون ادیومتر",1,"Headphones intended for audiology testing setups.","/products/demo/audiology.svg",450000000], ["Bone Conduction Headband","هدبند هدایت استخوانی",1,"An accessory for compatible testing setups.","/products/demo/audiology.svg",320000000], ["Patient Response Button","دکمه پاسخ بیمار",1,"A response accessory for testing workflows.","/products/demo/audiology.svg",80000000], ["Audiology Test Cable","کابل تست ادیولوژی",1,"A cable accessory for audiology equipment.","/products/demo/audiology.svg",60000000],
  ["Ear Examination Instrument Set","مجموعه ابزار معاینه گوش",2,"A collection of general examination tools.","/products/demo/clinical.svg",350000000], ["Audiology Equipment Stand","پایه تجهیزات ادیولوژی",2,"A support stand for compatible equipment.","/products/demo/clinical.svg",220000000], ["Clinical Carrying Case","کیف حمل تجهیزات کلینیکی",2,"A carrying case for clinical equipment.","/products/demo/clinical.svg",180000000],
  ["Disposable Otoscope Specula Pack","بسته اسپکولوم یکبار مصرف",3,"Disposable specula supplied as a demo pack.","/products/demo/consumable.svg",25000000], ["Probe Tube Pack","بسته تیوب پروب",3,"Probe-related consumables supplied as a demo pack.","/products/demo/consumable.svg",35000000],
  ["Reusable Otoscope Specula Set","مجموعه اسپکولوم قابل استفاده مجدد",4,"Reusable examination accessory set.","/products/demo/accessory.svg",65000000], ["Equipment Cleaning & Maintenance Kit","کیت نظافت و نگهداری تجهیزات",4,"General cleaning and maintenance accessories.","/products/demo/accessory.svg",45000000],
] as const

export default async function seedEarMedDemo({ container }: { container: MedusaContainer }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const productService = container.resolve(Modules.PRODUCT)
  const salesChannelService = container.resolve(Modules.SALES_CHANNEL)
  const channels = await salesChannelService.listSalesChannels({})
  const channel = channels[0]
  if (!channel) throw new Error("No sales channel exists. Configure a Medusa sales channel before seeding.")
  const existingCategories = await productService.listProductCategories({}, { take: 1000, select: ["id", "name", "handle"] })
  const missing = categories.filter(([name]) => !existingCategories.some((category: { name: string; handle?: string | null }) => category.name === name || category.handle === toHandle(name)))
  if (missing.length) await createProductCategoriesWorkflow(container).run({ input: { product_categories: missing.map(([name, fa]) => ({ name, is_active: true, metadata: { catalog_source: source, demo_version: "v1", fa_name: fa } })) } })
  const allCategories = await productService.listProductCategories({}, { take: 1000, select: ["id", "name", "handle"] })
  const existingProducts = await productService.listProducts(
    {},
    { take: 1000, select: ["id", "title", "metadata"] }
  )
  const missingProducts = products.filter(([title]) => !existingProducts.some((product: { title: string; metadata?: Record<string, unknown> | null }) => product.title === title || product.metadata?.catalog_source === source))
  if (missingProducts.length) await createProductsWorkflow(container).run({ input: { products: missingProducts.map(([title, faTitle, categoryIndex, description, image, amount]) => ({ title, description, status: ProductStatus.PUBLISHED, category_ids: [allCategories.find((category: { name: string; handle?: string | null }) => category.name === categories[categoryIndex][0] || category.handle === toHandle(categories[categoryIndex][0]))!.id], images: [{ url: image }], metadata: { catalog_source: source, demo_version: "v1", fa_title: faTitle, fa_short_description: description, price_status: "demo", specifications: { material: "Demo catalog placeholder", included_items: "As listed in product configuration" } }, options: [{ title: "Default", values: ["Default"] }], variants: [{ title: "Default", options: { Default: "Default" }, sku: `EARMED-DEMO-${title.replace(/[^A-Za-z0-9]/g, "-").toUpperCase()}`, manage_inventory: false, prices: [{ currency_code: "irr", amount }] }], sales_channels: [{ id: channel.id }] })) } })
  logger.info(`EarMed demo catalog ready on sales channel ${channel.id}`)
}
