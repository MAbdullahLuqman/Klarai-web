import React from "react";
import { FileSearch } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function EmptyState({ title = "Nothing here yet", description, actionLabel, onAction }) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <FileSearch className="h-5 w-5 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-base font-semibold">{title}</h3>
        {description && <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>}
        {actionLabel && onAction && (
          <Button type="button" className="mt-5" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
