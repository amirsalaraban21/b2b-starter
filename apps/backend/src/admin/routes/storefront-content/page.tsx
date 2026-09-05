import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Button, Container, Heading, Input, Select, StatusBadge, Text, Textarea, toast } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { sdk } from "../../lib/client"

type Key = "home" | "about" | "contact" | "faq"
type Locale = "fa" | "en"
type Document = Record<string, any>
type RecordItem = { id: string; key: Key; locale: Locale; content: Document; is_published: boolean }

const keys: Array<{ key: Key; label: string }> = [
  { key: "home", label: "Home" }, { key: "about", label: "About" },
  { key: "contact", label: "Contact" }, { key: "faq", label: "FAQ" },
]

const emptyContent = (key: Key): Document => {
  if (key === "home") return {
    hero_slides: [{ eyebrow: "", title: "", description: "", cta_label: "" }],
    departments_eyebrow: "", departments_title: "", departments_cta: "",
    editorial_eyebrow: "", editorial_title: "", editorial_text: "", editorial_cta: "",
    selected_products_title: "", selected_products_cta: "",
    battery_finder_eyebrow: "", battery_finder_title: "", battery_finder_text: "",
    professional_eyebrow: "", professional_title: "", professional_text: "", professional_cta: "",
  }
  if (key === "about") return {
    eyebrow: "", title: "", intro: "", scope_title: "", scope_body: "",
    categories_title: "", categories: [""], professional_title: "", professional_body: "",
    professional_action: "", approach_title: "", approach_items: [""],
  }
  if (key === "contact") return {
    eyebrow: "", title: "", intro: "", phone: null, email: null, address: null,
    working_hours: null, additional_text: null,
  }
  return { eyebrow: "", title: "", intro: "", items: [{ id: "faq-1", question: "", answer: "" }] }
}

const Field = ({ label, value, onChange, multiline = false, optional = false, dir }: {
  label: string; value: string | null | undefined; onChange: (value: string) => void
  multiline?: boolean; optional?: boolean; dir?: "rtl" | "ltr"
}) => <label className="grid gap-1.5">
  <Text size="small" weight="plus">{label}{optional ? " (optional)" : ""}</Text>
  {multiline
    ? <Textarea dir={dir} rows={4} value={value || ""} onChange={(event) => onChange(event.target.value)} />
    : <Input dir={dir} value={value || ""} onChange={(event) => onChange(event.target.value)} />}
</label>

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="grid gap-4 rounded-lg border border-ui-border-base p-4">
    <Heading level="h2">{title}</Heading>{children}
  </section>
)

const StorefrontContentPage = () => {
  const [key, setKey] = useState<Key>("home")
  const [locale, setLocale] = useState<Locale>("fa")
  const [content, setContent] = useState<Document>(() => emptyContent("home"))
  const [published, setPublished] = useState(false)
  const [exists, setExists] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const dir = locale === "fa" ? "rtl" : "ltr"

  const load = async () => {
    setLoading(true)
    try {
      const result = await sdk.client.fetch<{ storefront_content: RecordItem[] }>("/admin/storefront-content", { method: "GET" })
      const record = result.storefront_content.find((item) => item.key === key && item.locale === locale)
      setContent(record?.content || emptyContent(key))
      setPublished(Boolean(record?.is_published))
      setExists(Boolean(record))
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load storefront content.")
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { void load() }, [key, locale])

  const set = (field: string, value: unknown) => setContent((current) => ({ ...current, [field]: value }))
  const save = async (nextPublished: boolean) => {
    setSaving(true)
    try {
      const result = await sdk.client.fetch<{ storefront_content: RecordItem }>(`/admin/storefront-content/${key}`, {
        method: exists ? "PUT" : "POST",
        body: { locale, content, is_published: nextPublished },
      })
      setContent(result.storefront_content.content)
      setPublished(result.storefront_content.is_published)
      setExists(true)
      toast.success(nextPublished ? "Content published." : published ? "Content unpublished." : "Draft saved.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Content could not be saved.")
    } finally {
      setSaving(false)
    }
  }

  const simpleFields = (fields: Array<[string, string, boolean?]>) => fields.map(([field, label, multiline]) => (
    <Field key={field} label={label} value={content[field]} multiline={multiline} dir={dir} onChange={(value) => set(field, value)} />
  ))

  return <Container className="p-0">
    <header className="flex flex-wrap items-center justify-between gap-4 border-b px-6 py-4">
      <div><Heading>Storefront Content</Heading><Text size="small" className="text-ui-fg-subtle">Edit localized public-page copy without changing catalog data.</Text></div>
      <StatusBadge color={published ? "green" : "grey"}>{published ? "Published" : exists ? "Draft" : "Not created"}</StatusBadge>
    </header>
    <div className="flex flex-wrap gap-2 border-b px-6 py-3">
      {keys.map((item) => <Button key={item.key} size="small" variant={key === item.key ? "primary" : "secondary"} onClick={() => setKey(item.key)}>{item.label}</Button>)}
      <div className="ms-auto w-40"><Select value={locale} onValueChange={(value) => setLocale(value as Locale)}><Select.Trigger><Select.Value /></Select.Trigger><Select.Content><Select.Item value="fa">فارسی</Select.Item><Select.Item value="en">English</Select.Item></Select.Content></Select></div>
    </div>
    <div className="grid gap-5 p-6" aria-busy={loading}>
      {loading ? <Text>Loading content…</Text> : <div className="grid gap-5" dir={dir}>
        {key === "home" && <>
          <Section title="Hero slides">
            {(content.hero_slides || []).map((slide: Document, index: number) => <div key={index} className="grid gap-3 rounded border p-3">
              <div className="flex items-center justify-between"><Text weight="plus">Slide {index + 1}</Text>{content.hero_slides.length > 1 && <Button size="small" variant="transparent" onClick={() => set("hero_slides", content.hero_slides.filter((_: unknown, i: number) => i !== index))}>Remove</Button>}</div>
              {(["eyebrow", "title", "description", "cta_label"] as const).map((field) => <Field key={field} label={field.replaceAll("_", " ")} value={slide[field]} multiline={field === "description"} dir={dir} onChange={(value) => set("hero_slides", content.hero_slides.map((item: Document, i: number) => i === index ? { ...item, [field]: value } : item))} />)}
            </div>)}
            {content.hero_slides.length < 5 && <Button size="small" variant="secondary" onClick={() => set("hero_slides", [...content.hero_slides, { eyebrow: "", title: "", description: "", cta_label: "" }])}>Add slide</Button>}
          </Section>
          <Section title="Departments">{simpleFields([["departments_eyebrow", "Eyebrow"], ["departments_title", "Heading"], ["departments_cta", "CTA label"]])}</Section>
          <Section title="Editorial care section">{simpleFields([["editorial_eyebrow", "Eyebrow"], ["editorial_title", "Heading"], ["editorial_text", "Body", true], ["editorial_cta", "CTA label"]])}</Section>
          <Section title="Selected products">{simpleFields([["selected_products_title", "Heading"], ["selected_products_cta", "CTA label"]])}</Section>
          <Section title="Battery finder">{simpleFields([["battery_finder_eyebrow", "Eyebrow"], ["battery_finder_title", "Heading"], ["battery_finder_text", "Body", true]])}</Section>
          <Section title="Professional section">{simpleFields([["professional_eyebrow", "Eyebrow"], ["professional_title", "Heading"], ["professional_text", "Body", true], ["professional_cta", "CTA label"]])}</Section>
        </>}
        {key === "about" && <>
          <Section title="Introduction">{simpleFields([["eyebrow", "Eyebrow"], ["title", "Title"], ["intro", "Introduction", true]])}</Section>
          <Section title="Product scope">{simpleFields([["scope_title", "Heading"], ["scope_body", "Body", true], ["categories_title", "Categories heading"]])}<StringList values={content.categories} onChange={(value) => set("categories", value)} label="Category" dir={dir} /></Section>
          <Section title="Professional purchasing">{simpleFields([["professional_title", "Heading"], ["professional_body", "Body", true], ["professional_action", "CTA label"]])}</Section>
          <Section title="Approach">{simpleFields([["approach_title", "Heading"]])}<StringList values={content.approach_items} onChange={(value) => set("approach_items", value)} label="Approach item" dir={dir} /></Section>
        </>}
        {key === "contact" && <>
          <Section title="Contact page">{simpleFields([["eyebrow", "Eyebrow"], ["title", "Title"], ["intro", "Introduction", true]])}</Section>
          <Section title="Business details">
            <Text size="small" className="text-ui-fg-subtle">Leave optional fields empty until official details are available.</Text>
            {(["phone", "email", "address", "working_hours", "additional_text"] as const).map((field) => <Field key={field} label={field.replaceAll("_", " ")} value={content[field]} optional multiline={field === "address" || field === "additional_text"} dir={dir} onChange={(value) => set(field, value || null)} />)}
          </Section>
        </>}
        {key === "faq" && <>
          <Section title="FAQ introduction">{simpleFields([["eyebrow", "Eyebrow"], ["title", "Title"], ["intro", "Introduction", true]])}</Section>
          <Section title="FAQ items">
            {(content.items || []).map((item: Document, index: number) => <div key={`${item.id}-${index}`} className="grid gap-3 rounded border p-3">
              <div className="flex flex-wrap items-center justify-between gap-2"><Text weight="plus">Item {index + 1}</Text><div className="flex gap-1"><Button size="small" variant="transparent" disabled={!index} onClick={() => moveItem(content.items, index, -1, (items) => set("items", items))}>Up</Button><Button size="small" variant="transparent" disabled={index === content.items.length - 1} onClick={() => moveItem(content.items, index, 1, (items) => set("items", items))}>Down</Button><Button size="small" variant="transparent" disabled={content.items.length === 1} onClick={() => set("items", content.items.filter((_: unknown, i: number) => i !== index))}>Remove</Button></div></div>
              {(["id", "question", "answer"] as const).map((field) => <Field key={field} label={field === "id" ? "Stable ID (letters, numbers, _ or -)" : field} value={item[field]} multiline={field === "answer"} dir={field === "id" ? "ltr" : dir} onChange={(value) => set("items", content.items.map((entry: Document, i: number) => i === index ? { ...entry, [field]: value } : entry))} />)}
            </div>)}
            {content.items.length < 50 && <Button size="small" variant="secondary" onClick={() => set("items", [...content.items, { id: `faq-${Date.now()}`, question: "", answer: "" }])}>Add FAQ item</Button>}
          </Section>
        </>}
      </div>}
      <footer className="sticky bottom-0 -mx-6 -mb-6 flex flex-wrap justify-end gap-2 border-t bg-ui-bg-base px-6 py-4" dir="ltr">
        {published && <Button variant="secondary" isLoading={saving} onClick={() => void save(false)}>Unpublish</Button>}
        <Button variant="secondary" isLoading={saving} onClick={() => void save(published)}>{published ? "Save changes" : "Save draft"}</Button>
        {!published && <Button isLoading={saving} onClick={() => void save(true)}>Publish</Button>}
      </footer>
    </div>
  </Container>
}

const StringList = ({ values = [], onChange, label, dir }: { values?: string[]; onChange: (value: string[]) => void; label: string; dir: "rtl" | "ltr" }) => <div className="grid gap-2">
  {values.map((value, index) => <div key={index} className="flex gap-2"><Input dir={dir} aria-label={`${label} ${index + 1}`} value={value} onChange={(event) => onChange(values.map((item, i) => i === index ? event.target.value : item))} /><Button size="small" variant="secondary" disabled={values.length === 1} onClick={() => onChange(values.filter((_, i) => i !== index))}>Remove</Button></div>)}
  <Button size="small" variant="secondary" onClick={() => onChange([...values, ""])}>Add {label.toLowerCase()}</Button>
</div>

const moveItem = (items: Document[], index: number, delta: number, done: (items: Document[]) => void) => {
  const next = [...items]
  const target = index + delta
  ;[next[index], next[target]] = [next[target], next[index]]
  done(next)
}

export const config = defineRouteConfig({ label: "Storefront Content" })
export default StorefrontContentPage
