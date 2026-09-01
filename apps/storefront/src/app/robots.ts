import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const production = process.env.NODE_ENV === "production"
  return { rules: { userAgent: "*", allow: production ? "/" : "", disallow: production ? undefined : "/" }, sitemap: production ? "/sitemap.xml" : undefined }
}
