import { AmountCell } from "@/modules/common/components/amount-cell"
import Thumbnail from "@/modules/products/components/thumbnail"
import { AdminOrderLineItem, AdminOrderPreview } from "@medusajs/types"
import { Badge, Text } from "@medusajs/ui"
import { useMemo } from "react"

export const QuoteTableItem = ({
  item,
  originalItem,
  currencyCode,
}: {
  item: AdminOrderPreview["items"][0]
  originalItem?: AdminOrderLineItem
  currencyCode: string
}) => {
  const isAddedItem = useMemo(
    () => !!item.actions?.find((a) => a.action === "ITEM_ADD"),
    [item]
  )

  const isItemUpdated = useMemo(
    () => !!item.actions?.find((a) => a.action === "ITEM_UPDATE"),
    [item]
  )

  const isItemRemoved = useMemo(() => {
    const updateAction = item.actions?.find((a) => a.action === "ITEM_UPDATE")

    return !!updateAction && item.quantity === item.detail.fulfilled_quantity
  }, [item])

  return (
    <div className="flex min-w-0 gap-x-3 xsmall:gap-x-4">
      <Thumbnail thumbnail={item.thumbnail} size="square" className="w-14 shrink-0 xsmall:w-16" />

      <div className="flex min-w-0 w-full flex-col">
        <div className="min-w-0 break-words">
          <Text
            size="small"
            leading="compact"
            weight="plus"
            className="text-ui-fg-base"
          >
            {item.product_title}
          </Text>

          {item.variant_sku && (
            <div className="flex items-center gap-x-1">
              <Text size="small">{item.variant_sku}</Text>
            </div>
          )}
          <Text size="small">
            {item.variant?.options?.map((o) => o.value).join(" · ")}
          </Text>
        </div>

        <div className="mt-2 flex w-full min-w-0 flex-col items-start gap-2 xsmall:flex-row xsmall:flex-wrap xsmall:items-center xsmall:justify-between">
          <div>
            <Text className="text-">
              <span>{item.quantity}</span>x{" "}
            </Text>
          </div>

          <div className="flex max-w-full flex-wrap gap-2">
            <AmountCell
                className="text-sm text-end justify-end items-end"
              currencyCode={currencyCode}
              amount={item.unit_price}
              originalAmount={originalItem?.unit_price}
            />

            {isAddedItem && (
              <Badge
                size="2xsmall"
                rounded="full"
                color="blue"
                className="me-1"
              >
                New
              </Badge>
            )}

            {isItemRemoved ? (
              <Badge size="2xsmall" rounded="full" color="red" className="me-1">
                Removed
              </Badge>
            ) : (
              isItemUpdated && (
                <Badge
                  size="2xsmall"
                  rounded="full"
                  color="orange"
                  className="me-1"
                >
                  Modified
                </Badge>
              )
            )}
          </div>

          <div>
            <AmountCell
              className="text-sm text-end justify-end items-end"
              currencyCode={currencyCode}
              amount={item.total}
              originalAmount={originalItem?.total}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
