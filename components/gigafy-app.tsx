"use client";

import { useState, useCallback } from "react";
import { Zap, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadZone } from "@/components/upload-zone";
import { ResultDisplay } from "@/components/result-display";
import { ContractAddress } from "@/components/contract-address";

export function GigafyApp() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageSelected = useCallback((file: File, previewUrl: string) => {
    setSelectedFile(file);
    setPreview(previewUrl);
    setResultImage(null);
  }, []);

  const handleClear = useCallback(() => {
    setSelectedFile(null);
    setPreview(null);
    setResultImage(null);
  }, []);

  const handleGigafy = useCallback(async () => {
    if (!selectedFile) return;

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";
      const res = await fetch(`${apiBase}/api/gigafy`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setResultImage(data.url);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to gigafy your image";
      alert(message);
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile, preview]);

  const handleReset = useCallback(() => {
    setSelectedFile(null);
    setPreview(null);
    setResultImage(null);
    setIsProcessing(false);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              GIGAFY
            </h1>
          </div>
          {(preview || resultImage) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4" />
              Start Over
            </Button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10 md:py-16">
        {/* Hero */}
        <div className="mb-12 text-center">
          <h2 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Become the
            <span className="text-primary"> GigaChad</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground font-body">
            Upload your photo. Hit the button. Get your legendary transformation.
          </p>
          <div className="mt-6">
            <ContractAddress />
          </div>
        </div>

        {/* Before / After Grid */}
        <div className="grid gap-8 md:grid-cols-[1fr_auto_1fr] md:items-center">
          {/* Upload Side */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                1
              </span>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Before
              </h3>
            </div>
            <UploadZone
              onImageSelected={handleImageSelected}
              currentPreview={preview}
              onClear={handleClear}
            />
          </div>

          {/* Center Arrow + Button */}
          <div className="flex flex-col items-center gap-4">
            <div className="hidden md:block">
              <ArrowRight className="h-8 w-8 text-primary" />
            </div>
            <Button
              size="lg"
              disabled={!selectedFile || isProcessing}
              onClick={handleGigafy}
              className="gap-2 bg-primary text-primary-foreground px-8 py-6 text-base font-bold uppercase tracking-wider hover:bg-primary/90 disabled:opacity-40"
            >
              <Zap className="h-5 w-5" />
              {isProcessing ? "Processing..." : "Gigafy"}
            </Button>
            <div className="block md:hidden">
              <ArrowRight className="h-8 w-8 rotate-90 text-primary" />
            </div>
          </div>

          {/* Result Side */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                2
              </span>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                After
              </h3>
            </div>
            <ResultDisplay
              resultImage={resultImage}
              isProcessing={isProcessing}
            />
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Upload Anything",
              desc: "Selfie, group photo, your pet — we don't judge.",
            },
            {
              title: "AI Powered",
              desc: "State-of-the-art model transforms your photo instantly.",
            },
            {
              title: "Download & Share",
              desc: "Save your GigaChad moment or share it with the world.",
            },
          ].map((feat) => (
            <div
              key={feat.title}
              className="rounded-lg border border-border bg-card p-6"
            >
              <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
                {feat.title}
              </h4>
              <p className="mt-2 text-sm text-muted-foreground font-body leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-5xl px-6 py-6">
          <p className="text-center text-xs text-muted-foreground">
            GIGAFY &mdash; For educational and entertainment purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
}
