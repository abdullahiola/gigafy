"use client";

import { Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResultDisplayProps {
  resultImage: string | null;
  isProcessing: boolean;
}

export function ResultDisplay({ resultImage, isProcessing }: ResultDisplayProps) {
  if (isProcessing) {
    return (
      <div className="flex aspect-square w-full flex-col items-center justify-center gap-6 rounded-lg border-2 border-border bg-card">
        <div className="relative">
          <div className="h-20 w-20 rounded-full border-4 border-secondary" />
          <div className="absolute inset-0 h-20 w-20 animate-spin rounded-full border-4 border-transparent border-t-primary" />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-foreground tracking-wide uppercase">
            Gigafying...
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Unleashing your inner legend
          </p>
        </div>
      </div>
    );
  }

  if (resultImage) {
    return (
      <div className="space-y-3">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg border-2 border-primary/30 bg-card">
          <img
            src={resultImage || "/placeholder.svg"}
            alt="Gigachad transformation result"
            className="h-full w-full object-cover"
          />
          <div className="absolute top-3 right-3 rounded-md bg-primary px-3 py-1">
            <span className="text-xs font-bold text-primary-foreground uppercase tracking-wider">
              Gigafied
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2 bg-transparent"
            onClick={() => {
              const link = document.createElement("a");
              link.href = resultImage;
              link.download = "gigafied.png";
              link.click();
            }}
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2 bg-transparent"
            onClick={async () => {
              if (navigator.share) {
                try {
                  await navigator.share({
                    title: "My Gigafied Photo",
                    text: "Check out my GigaChad transformation!",
                    url: window.location.href,
                  });
                } catch {
                  // user cancelled
                }
              }
            }}
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex aspect-square w-full flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-border bg-card">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
        <svg
          className="h-8 w-8 text-muted-foreground"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3v18" />
          <path d="M5 12h14" />
          <circle cx="12" cy="12" r="10" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-foreground">
          GigaChad Output
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Your transformation will appear here
        </p>
      </div>
    </div>
  );
}
