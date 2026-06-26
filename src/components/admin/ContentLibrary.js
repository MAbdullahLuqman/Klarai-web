"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpDown, ExternalLink, Pencil, Search } from "lucide-react";
import { normalizeAnyContentForAdmin } from "@/lib/adminContentAdapters";
import { getCanonicalPathForContent } from "@/lib/routeRules";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EmptyState from "./EmptyState";
import PageHeader from "./PageHeader";
import StatusBadge from "./StatusBadge";

export default function ContentLibrary({ collections = {}, onEdit }) {
  const [query, setQuery] = useState("");
  const [collectionFilter, setCollectionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortKey, setSortKey] = useState("updated");

  const items = useMemo(() => {
    return Object.entries(collections).flatMap(([collection, docs]) =>
      Object.entries(docs || {}).map(([id, doc]) => normalizeAnyContentForAdmin(collection, id, doc))
    );
  }, [collections]);

  const filtered = items
    .filter((item) => collectionFilter === "all" || item.collection === collectionFilter)
    .filter((item) => statusFilter === "all" || item.status === statusFilter)
    .filter((item) => {
      const text = `${item.title} ${item.slug} ${item.collection} ${item.primaryService || ""} ${item.industry || ""}`.toLowerCase();
      return text.includes(query.toLowerCase());
    })
    .sort((a, b) => {
      if (sortKey === "title") return String(a.title || "").localeCompare(String(b.title || ""));
      if (sortKey === "status") return String(a.status || "").localeCompare(String(b.status || ""));
      return String(b.raw?.updatedAt?.seconds || "").localeCompare(String(a.raw?.updatedAt?.seconds || ""));
    });

  return (
    <div className="space-y-6 p-5 md:p-8">
      <PageHeader
        eyebrow="Content management"
        title="Pages"
        description="Search, filter, preview, and edit content without changing existing routes or Firebase collections."
      />
      <Card>
        <CardContent className="p-4">
          <div className="grid gap-3 md:grid-cols-[1fr_220px_180px_170px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search content, slugs, services, industries..."
                className="pl-9"
              />
            </div>
            <Select value={collectionFilter} onChange={(event) => setCollectionFilter(event.target.value)}>
              <option value="all">All collections</option>
              <option value="pages">Services</option>
              <option value="blog_posts">Blog & guides</option>
              <option value="industry_pages">Industries</option>
              <option value="niche_pages">Niche pages</option>
              <option value="case_studies">Case studies</option>
              <option value="static_pages">Static pages</option>
            </Select>
            <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="archived">Archived</option>
            </Select>
            <Select value={sortKey} onChange={(event) => setSortKey(event.target.value)} aria-label="Sort content">
              <option value="updated">Newest first</option>
              <option value="title">Title A-Z</option>
              <option value="status">Status</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[320px]">
                <button type="button" className="inline-flex items-center gap-2" onClick={() => setSortKey("title")}>
                  Title <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead>Collection</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Route</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => {
              const path = getCanonicalPathForContent(item);
              return (
                <TableRow key={`${item.collection}-${item.id}`}>
                  <TableCell>
                    <p className="font-medium text-foreground">{item.title || item.id}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{item.excerpt || "No summary added yet."}</p>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{item.collection}</TableCell>
                  <TableCell><StatusBadge status={item.status} /></TableCell>
                  <TableCell><code className="text-xs text-primary">{path}</code></TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button type="button" size="sm" onClick={() => onEdit?.(item)}>
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link href={path} target="_blank">
                          <ExternalLink className="h-3.5 w-3.5" />
                          Preview
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {filtered.length === 0 && (
          <div className="p-6">
            <EmptyState title="No content matched" description="Try clearing a filter or searching by a different title, slug, service, or industry." />
          </div>
        )}
      </Card>
    </div>
  );
}
