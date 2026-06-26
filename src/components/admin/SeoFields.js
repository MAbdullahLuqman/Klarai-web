import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import FormSection from "./FormSection";

export default function SeoFields({ value = {}, onChange }) {
  const update = (field, nextValue) => onChange?.({ ...value, [field]: nextValue });
  return (
    <FormSection title="SEO fields" description="Search and social metadata used by this content item.">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Meta title</Label>
          <Input value={value.metaTitle || value.title || ""} onChange={(event) => update("metaTitle", event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Canonical URL</Label>
          <Input value={value.canonicalUrl || ""} onChange={(event) => update("canonicalUrl", event.target.value)} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Meta description</Label>
        <Textarea value={value.metaDescription || ""} onChange={(event) => update("metaDescription", event.target.value)} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>OG title</Label>
          <Input value={value.ogTitle || ""} onChange={(event) => update("ogTitle", event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>OG image</Label>
          <Input value={value.ogImage || ""} onChange={(event) => update("ogImage", event.target.value)} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>OG description</Label>
        <Textarea value={value.ogDescription || ""} onChange={(event) => update("ogDescription", event.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Schema / JSON-LD</Label>
        <Textarea value={value.schemaJsonLd || ""} onChange={(event) => update("schemaJsonLd", event.target.value)} className="font-mono" />
      </div>
    </FormSection>
  );
}
