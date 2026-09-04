import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { assertQuoteOwnership } from "../ownership";

describe("store quote ownership", () => {
  it("queries a quote by both quote and authenticated customer IDs", async () => {
    const graph = jest.fn().mockResolvedValue({ data: [{ id: "quo_test" }] });
    const scope = {
      resolve: jest.fn((key: string) => {
        expect(key).toBe(ContainerRegistrationKeys.QUERY);
        return { graph };
      }),
    };

    await expect(
      assertQuoteOwnership(scope as never, "quo_test", "cus_owner")
    ).resolves.toEqual({ id: "quo_test" });
    expect(graph).toHaveBeenCalledWith(
      {
        entity: "quote",
        fields: ["id"],
        filters: { id: "quo_test", customer_id: "cus_owner" },
      },
      { throwIfKeyNotFound: true }
    );
  });
});
