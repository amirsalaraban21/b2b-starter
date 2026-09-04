import { PROFESSIONAL_APPLICATION_MODULE } from "..";
import { isApprovedProfessional } from "../entitlement";

describe("professional entitlement", () => {
  test.each([
    ["pending", false],
    ["needs_information", false],
    ["rejected", false],
    ["approved", true],
  ])("status %s grants entitlement: %s", async (status, expected) => {
    const listProfessionalApplications = jest
      .fn()
      .mockResolvedValue(
        status === "approved" ? [{ id: "proapp_test", status }] : []
      );
    const scope = {
      resolve: jest.fn((key: string) => {
        expect(key).toBe(PROFESSIONAL_APPLICATION_MODULE);
        return { listProfessionalApplications };
      }),
    };

    await expect(
      isApprovedProfessional(scope as never, "cus_test")
    ).resolves.toBe(expected);
    expect(listProfessionalApplications).toHaveBeenCalledWith(
      { customer_id: "cus_test", status: "approved" },
      { take: 1 }
    );
  });
});
