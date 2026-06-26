"use client";

import React from "react";
import RoutePreviewCard from "./RoutePreviewCard";
import SeoChecklist from "./SeoChecklist";

export default function ContentEditorFrame({ item, routePath, children, aside }) {
  return (
    <div className="grid gap-6 p-6 md:p-8 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="min-w-0">{children}</div>
      <aside className="space-y-5">
        <RoutePreviewCard path={routePath || item?.canonicalPath} status={item?.status} />
        <SeoChecklist item={item} />
        {aside}
      </aside>
    </div>
  );
}
