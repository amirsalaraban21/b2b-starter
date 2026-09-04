import type {
  MedusaContainer,
  RemoteQueryFunction,
} from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export const assertQuoteOwnership = async (
  scope: MedusaContainer,
  quoteId: string,
  customerId: string
) => {
  const query = scope.resolve<RemoteQueryFunction>(
    ContainerRegistrationKeys.QUERY
  );
  const {
    data: [quote],
  } = await query.graph(
    {
      entity: "quote",
      fields: ["id"],
      filters: { id: quoteId, customer_id: customerId },
    },
    { throwIfKeyNotFound: true }
  );

  return quote;
};
