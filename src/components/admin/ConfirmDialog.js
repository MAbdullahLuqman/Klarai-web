"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function ConfirmDialog({ open, title = "Are you sure?", description, confirmLabel = "Confirm", cancelLabel = "Cancel", onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        {description && <CardContent className="text-sm text-muted-foreground">{description}</CardContent>}
        <CardFooter className="justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>{cancelLabel}</Button>
          <Button type="button" variant="destructive" onClick={onConfirm}>{confirmLabel}</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
