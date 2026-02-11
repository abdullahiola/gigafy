"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

const CONTRACT_ADDRESS = "BEGbkiLDZSmjXtRzypLs6GGJaxdfYeVEuFvr3KJDpump";

export function ContractAddress() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CONTRACT_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = CONTRACT_ADDRESS;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="group mx-auto flex w-full max-w-lg items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:border-primary/50 hover:bg-card/80"
    >
      <span className="shrink-0 text-xs font-bold uppercase tracking-wider text-primary">
        CA
      </span>
      <span className="min-w-0 flex-1 truncate text-left font-mono text-sm text-muted-foreground">
        {CONTRACT_ADDRESS}
      </span>
      <span className="shrink-0">
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
        )}
      </span>
    </button>
  );
}
