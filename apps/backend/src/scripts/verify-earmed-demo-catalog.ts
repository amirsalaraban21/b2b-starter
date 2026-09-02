import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

const source = "earmed_demo"

export default async function verifyEarMedDemo({ container }: { container: MedusaContainer }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const productService = container.resolve(Modules.PRODUCT) as any
  const salesChannelService = container.resolve(Modules.SALES_CHANNEL) as any
  const categories = await productService.listProductCategories({}, { take: 1000, select: ["id", "name", "handle", "metadata"] })
  const products = await productService.listProducts({}, { take: 1000, select: ["id", "title", "status", "metadata"], relations: ["variants", "categories", "sales_channels"] })
  const channels = await salesChannelService.listSalesChannels({}, { take: 1000 })
  const earMedCategories = categories.filter((category: any) => category.metadata?.catalog_source === source)
  const earMedProducts = products.filter((product: any) => product.metadata?.catalog_source === source)
  logger.info(JSON.stringify({
    categories: earMedCategories.map((category: any) => ({ id: category.id, name: category.name, handle: category.handle })),
    products: earMedProducts.map((product: any) => ({ id: product.id, title: product.title, status: product.status, categories: product.categories?.map((category: any) => category.name), variants: product.variants?.map((variant: any) => ({ id: variant.id, manage_inventory: variant.manage_inventory, sku: variant.sku })), sales_channels: product.sales_channels?.map((channel: any) => channel.id) })),
    sales_channels: channels.map((channel: any) => ({ id: channel.id, name: channel.name }))
  }))
}
