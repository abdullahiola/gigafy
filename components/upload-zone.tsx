"use client";

import React from "react"

import { useCallback, useState } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onImageSelected: (file: File, preview: string) => void;
  currentPreview: string | null;
  onClear: () => void;
}

export function UploadZone({
  onImageSelected,
  currentPreview,
  onClear,
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageSelected(file, e.target?.result as string);
      };
      reader.readAsDataURL(file);
    },
    [onImageSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  if (currentPreview) {
    return (
      <div className="relative group">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg border-2 border-border bg-card">
          <img
            src={currentPreview || "/placeholder.svg"}
            alt="Uploaded photo"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={onClear}
              className="flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground transition-transform hover:scale-105"
            >
              <X className="h-4 w-4" />
              Remove
            </button>
          </div>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Hover to remove
        </p>
      </div>
    );
  }

  return (
    <label
      htmlFor="image-upload"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        "flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed transition-all",
        isDragging
          ? "border-primary bg-primary/10 scale-[1.02]"
          : "border-border bg-card hover:border-primary/50 hover:bg-card/80"
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
        {isDragging ? (
          <ImageIcon className="h-8 w-8 text-primary" />
        ) : (
          <Upload className="h-8 w-8 text-muted-foreground" />
        )}
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-foreground">
          {isDragging ? "Drop it here" : "Drop your photo here"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          or click to browse
        </p>
      </div>
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleInputChange}
      />
    </label>
  );
}
