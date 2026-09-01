"use client"

import { Heading } from "@medusajs/ui"
import Button from "@/modules/common/components/button"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { getLocale, messages } from "@/lib/i18n"
import { useEffect, useState } from "react"
import Image from "next/image"

const Hero = () => {
  const [locale, setLocale] = useState("fa")
  useEffect(() => setLocale(document.documentElement.lang), [])
  const t = messages[getLocale(locale)]
  return (
    <div className="min-h-[460px] h-[65vh] w-full overflow-hidden border-b border-ui-border-base relative bg-neutral-100">
      <Image
        src="/hero-image.jpg"
        alt="Hero background"
        layout="fill"
        quality={100}
        priority
      />
      <div className="absolute inset-0 z-1 flex flex-col justify-center items-center text-center p-6 small:p-32 gap-6 bg-white/35">
        <span>
          <p className="text-neutral-600 text-xs uppercase">
            {t.heroEyebrow}
          </p>

          <Heading
            level="h1"
            className="text-6xl leading-10 text-ui-fg-base font-normal mt-10 mb-5"
          >
            {t.heroTitle}
          </Heading>

          <p className="leading-10 text-ui-fg-subtle font-normal text-lg">
            {t.heroDescription}
          </p>
        </span>
        <LocalizedClientLink href="/store">
          <Button variant="secondary" className="rounded-2xl">{t.exploreProducts}</Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default Hero
