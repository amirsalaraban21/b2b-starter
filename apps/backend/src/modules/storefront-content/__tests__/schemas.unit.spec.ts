import {
  AdminUpsertStorefrontContent,
  ContactContentSchema,
  FAQContentSchema,
} from "../schemas"

describe("storefront content schemas", () => {
  const contact = {
    eyebrow: "Contact",
    title: "Contact EarMed",
    intro: "Contact details for the storefront.",
    phone: null,
    email: "support@example.invalid",
    address: null,
    working_hours: null,
    additional_text: null,
  }

  it("accepts a valid admin envelope and contact document", () => {
    expect(AdminUpsertStorefrontContent.safeParse({
      locale: "en",
      content: contact,
      is_published: false,
    }).success).toBe(true)
    expect(ContactContentSchema.safeParse(contact).success).toBe(true)
  })

  it("rejects unknown admin fields and oversized content", () => {
    expect(AdminUpsertStorefrontContent.safeParse({
      locale: "en",
      content: contact,
      is_published: false,
      approved: true,
    }).success).toBe(false)
    expect(ContactContentSchema.safeParse({
      ...contact,
      intro: "x".repeat(4001),
    }).success).toBe(false)
  })

  it("rejects duplicate FAQ item identifiers", () => {
    const item = { id: "shipping", question: "Shipping?", answer: "Details." }
    expect(FAQContentSchema.safeParse({
      eyebrow: "FAQ",
      title: "Questions",
      intro: "Common questions.",
      items: [item, item],
    }).success).toBe(false)
  })
})
