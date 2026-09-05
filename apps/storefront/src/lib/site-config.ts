import type { Locale } from "@/lib/i18n"

const localized = {
  fa: {
    displayName: "EarMed Store",
    tagline: "تجهیزات و محصولات تخصصی شنوایی",
    description:
      "فروشگاه تجهیزات و محصولات تخصصی شنوایی برای مشتریان، متخصصان و مراکز درمانی.",
    metadataTitle: "EarMed Store | تجهیزات شنوایی",
    metadataDescription:
      "تجهیزات و محصولات تخصصی شنوایی برای مشتریان، متخصصان و مراکز درمانی.",
    copyright: "تمامی حقوق محفوظ است.",
  },
  en: {
    displayName: "EarMed Store",
    tagline: "Specialist hearing-care products",
    description:
      "Hearing-care products and equipment for customers, professionals, and care organizations.",
    metadataTitle: "EarMed Store | Hearing-care products",
    metadataDescription:
      "Hearing-care products and equipment for customers, professionals, and care organizations.",
    copyright: "All rights reserved.",
  },
} as const

export const siteConfig = {
  legalName: null,
  supportEmail: null,
  supportPhone: null,
  contactAddress: null,
  workingHours: null,
  additionalContactText: null,
  socialImage: null,
  copyrightOwner: "EarMed Store",
  localized,
} as const

export const getSiteConfig = (locale: Locale) => ({
  ...siteConfig,
  ...siteConfig.localized[locale],
})
