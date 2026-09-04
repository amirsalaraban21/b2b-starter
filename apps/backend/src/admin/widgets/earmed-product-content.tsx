import { defineWidgetConfig } from "@medusajs/admin-sdk";
import {
  Button,
  Container,
  Heading,
  Input,
  Text,
  Textarea,
  toast,
} from "@medusajs/ui";
import { useEffect, useState } from "react";
import { sdk } from "../lib/client";

type ProductData = { id: string; metadata?: Record<string, unknown> | null };

const EarMedProductContentWidget = ({ data }: { data: ProductData }) => {
  const metadata = data.metadata || {};
  const isEarMed = metadata.catalog_source === "earmed_core";
  const [enabled, setEnabled] = useState(isEarMed);
  const [title, setTitle] = useState(String(metadata.fa_title || ""));
  const [description, setDescription] = useState(
    String(metadata.fa_short_description || "")
  );
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    setEnabled(isEarMed);
    setTitle(String(metadata.fa_title || ""));
    setDescription(String(metadata.fa_short_description || ""));
  }, [data.id, isEarMed]);

  const save = async (initialize = false) => {
    setSaving(true);
    try {
      await sdk.admin.product.update(data.id, {
        metadata: {
          ...metadata,
          ...(initialize ? { catalog_source: "earmed_core" } : {}),
          fa_title: title.trim(),
          fa_short_description: description.trim(),
        },
      });
      setEnabled(true);
      toast.success("EarMed Persian content saved.");
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Could not update product metadata."
      );
    } finally {
      setSaving(false);
    }
  };

  if (!enabled)
    return (
      <Container>
        <div className="flex items-center justify-between gap-4">
          <div>
            <Heading level="h2">EarMed Persian Content</Heading>
            <Text size="small" className="text-ui-fg-subtle">
              This product is not marked as an EarMed core catalog product.
            </Text>
          </div>
          <Button
            variant="secondary"
            onClick={() => void save(true)}
            isLoading={saving}
          >
            Initialize EarMed metadata
          </Button>
        </div>
      </Container>
    );
  return (
    <Container>
      <Heading level="h2">EarMed Persian Content</Heading>
      <Text size="small" className="text-ui-fg-subtle">
        محتوای فارسی EarMed
      </Text>
      <div className="mt-4 grid gap-4">
        <label>
          <Text size="small" weight="plus">
            Persian title (fa_title)
          </Text>
          <Input
            className="mt-2"
            dir="rtl"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label>
          <Text size="small" weight="plus">
            Persian short description (fa_short_description)
          </Text>
          <Textarea
            className="mt-2"
            dir="rtl"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <div className="rounded border bg-ui-bg-subtle p-3">
          <Text size="small">
            <strong>Catalog source:</strong>{" "}
            {String(metadata.catalog_source || "—")}
          </Text>
          <Text size="small">
            <strong>Demo version:</strong>{" "}
            {String(metadata.demo_version || "—")}
          </Text>
          <Text size="small">
            <strong>Price status:</strong>{" "}
            {String(metadata.price_status || "—")}
          </Text>
          <Text size="small">
            <strong>Specifications:</strong>{" "}
            {metadata.specifications
              ? JSON.stringify(metadata.specifications, null, 2)
              : "—"}
          </Text>
        </div>
        <div>
          <Button onClick={() => void save()} isLoading={saving}>
            Save Persian content
          </Button>
        </div>
      </div>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "product.details.after",
  id: "earmed-persian-product-content",
});
export default EarMedProductContentWidget;
