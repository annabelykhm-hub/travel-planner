"use client";

import { useRef, useState, useTransition } from "react";
import { FileText, Trash2, Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { TripDocument } from "@/lib/types";
import { deleteDocument, getDocumentUrl, uploadDocument } from "@/lib/actions/documents";
import { formatBytes } from "@/lib/utils";

export function DocumentsTab({ tripId, documents }: { tripId: string; documents: TripDocument[] }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    const formData = new FormData();
    formData.set("file", file);
    startTransition(async () => {
      try {
        await uploadDocument(tripId, formData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    });
  }

  async function handleOpen(doc: TripDocument) {
    const url = await getDocumentUrl(doc.file_path);
    window.open(url, "_blank");
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}
      <div className="flex justify-end">
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button size="sm" onClick={() => fileInputRef.current?.click()} disabled={isPending}>
          <Upload className="h-4 w-4" />
          {isPending ? "Uploading…" : "Upload PDF"}
        </Button>
      </div>

      {documents.length === 0 ? (
        <p className="text-sm text-muted-foreground">No documents yet.</p>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="flex items-center gap-3 p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                  <FileText className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{doc.file_name}</p>
                  <p className="text-xs text-muted-foreground">{formatBytes(doc.file_size)}</p>
                </div>
                <button
                  onClick={() => handleOpen(doc)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Open document"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  onClick={() => startTransition(() => deleteDocument(doc.id, doc.file_path, tripId))}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label="Delete document"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
