"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

const LANG_LABEL: Record<string, string> = {
  bash: "Terminal",
  sh: "Terminal",
  powershell: "PowerShell",
  ts: "TypeScript",
  tsx: "TypeScript",
  js: "JavaScript",
  mjs: "JavaScript",
  json: "JSON",
  yaml: "YAML",
  dart: "Dart",
  kotlin: "Kotlin",
  kts: "Gradle (Kotlin)",
  xml: "XML",
  properties: "Properties",
  env: ".env",
  nginx: "Nginx",
  text: "Text",
};

export function CodeBlock({ code, lang, title }: { code: string; lang: string; title?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked – the text can still be selected */
    }
  };
  return (
    <div className="group my-6 overflow-hidden rounded-xl border border-[#1f2937] bg-[#0d1117] text-[13.5px]">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-2">
        <span className="truncate font-mono text-xs text-gray-300">{title ?? LANG_LABEL[lang] ?? lang}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-gray-300 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
          aria-label={copied ? "Copied" : "Copy code"}
        >
          {copied ? <Check aria-hidden="true" className="size-3.5 text-emerald-400" /> : <Copy aria-hidden="true" className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 leading-6 text-gray-100">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
}
