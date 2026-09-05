import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
}

const OrderDetails = ({ order }: OrderDetailsProps) => {
  const createdAt = new Date(order.created_at)

  return (
    <>
      <Heading level="h3" className="mb-2">
        Details
      </Heading>

      <div className="min-w-0 text-sm text-ui-fg-subtle">
        <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
          <Text>Order Number</Text>
          <Text>#{order.display_id}</Text>
        </div>

        <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 mb-2">
          <Text>Order Date</Text>
          <Text>
            {" "}
            {createdAt.getDate()}-{createdAt.getMonth()}-
            {createdAt.getFullYear()}
          </Text>
        </div>

        <Text>
          We have sent the order confirmation details to{" "}
          <span className="break-all font-semibold">{order.email}</span>.
        </Text>
      </div>
    </>
  )
}

export default OrderDetails
