"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, Pencil, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import EmptyState from "./EmptyState";
import PageHeader from "./PageHeader";
import StatusBadge from "./StatusBadge";

export default function SectionContentHub({
  eyebrow,
  title,
  description,
  items = [],
  onEdit,
  onCreate,
  createLabel = "New page",
  emptyText = "No pages found.",
}) {
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return items;
    return items.filter((item) => {
      const haystack = [item.title, item.subtitle, item.path, item.status, item.type, item.industry, item.service]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(search);
    });
  }, [items, query]);

  return (
    <section className="p-5 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <PageHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
          actions={
            <Button type="button" onClick={onCreate} className="w-full lg:w-auto">
              <Plus className="h-4 w-4" />
              {createLabel}
            </Button>
          }
        />

        <Card>
          <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search title, route, status, service, industry"
                className="pl-9"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredItems.length} of {items.length} visible
            </div>
          </CardContent>
        </Card>

        {filteredItems.length === 0 ? (
          <EmptyState title={emptyText} description="Try a different search or create a new item from the action above." />
        ) : (
          <div className="grid gap-3">
            {filteredItems.map((item) => (
              <Card key={item.id} className="transition hover:border-primary/40">
                <CardContent className="grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_auto]">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-base font-semibold text-foreground">{item.title || item.id}</h3>
                      {item.status && <StatusBadge status={item.status} />}
                      {item.type && (
                        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                          {item.type}
                        </span>
                      )}
                    </div>
                    {item.subtitle && <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{item.subtitle}</p>}
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {item.path && <code className="text-primary">{item.path}</code>}
                      {item.service && <span>{item.service}</span>}
                      {item.industry && <span>{item.industry}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:justify-end">
                    {item.path && (
                      <Button asChild variant="outline" size="sm">
                        <Link href={item.path} target="_blank">
                          <ExternalLink className="h-3.5 w-3.5" />
                          Preview
                        </Link>
                      </Button>
                    )}
                    <Button type="button" size="sm" onClick={() => onEdit?.(item)}>
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
