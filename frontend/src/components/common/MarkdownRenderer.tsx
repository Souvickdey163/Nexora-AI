"use client";

import React, { useState } from "react";
import { Check, Copy, Code2 } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyCode = (codeText: string, index: number) => {
    navigator.clipboard.writeText(codeText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Helper to parse inline styles (bold, code, links)
  const renderFormattedText = (text: string) => {
    // Split by inline code `...` first
    const codeParts = text.split(/(`[^`]+`)/g);

    return codeParts.map((part, pIdx) => {
      if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
        return (
          <code
            key={pIdx}
            className="px-1.5 py-0.5 mx-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 font-mono text-[11px] font-semibold border border-sky-500/20"
          >
            {part.slice(1, -1)}
          </code>
        );
      }

      // Format bold **text**
      const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
      return boldParts.map((bPart, bIdx) => {
        if (bPart.startsWith("**") && bPart.endsWith("**") && bPart.length > 4) {
          return (
            <strong key={bIdx} className="font-extrabold text-slate-900 dark:text-white">
              {bPart.slice(2, -2)}
            </strong>
          );
        }

        // Format italic *text*
        const italicParts = bPart.split(/(\*[^*]+\*)/g);
        return italicParts.map((iPart, iIdx) => {
          if (iPart.startsWith("*") && iPart.endsWith("*") && iPart.length > 2) {
            return (
              <em key={iIdx} className="italic">
                {iPart.slice(1, -1)}
              </em>
            );
          }
          return iPart;
        });
      });
    });
  };

  // Split content by code blocks ```lang ... ```
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  const blocks: Array<{ type: "code" | "text"; content: string; language?: string }> = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      blocks.push({
        type: "text",
        content: content.substring(lastIndex, match.index),
      });
    }
    blocks.push({
      type: "code",
      language: match[1] || "code",
      content: match[2].trim(),
    });
    lastIndex = codeBlockRegex.lastIndex;
  }

  if (lastIndex < content.length) {
    blocks.push({
      type: "text",
      content: content.substring(lastIndex),
    });
  }

  return (
    <div className={`space-y-3 font-sans leading-relaxed text-xs ${className}`}>
      {blocks.map((block, blockIdx) => {
        if (block.type === "code") {
          return (
            <div
              key={blockIdx}
              className="my-3 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl"
            >
              {/* Code Block Header Bar */}
              <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-[10px] font-mono text-slate-400">
                <div className="flex items-center gap-1.5 font-bold uppercase text-sky-400">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>{block.language}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCode(block.content, blockIdx)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors font-sans font-semibold"
                >
                  {copiedIndex === blockIdx ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code Contents */}
              <pre className="p-4 overflow-x-auto font-mono text-[11px] leading-relaxed text-slate-200 scrollbar-thin">
                <code>{block.content}</code>
              </pre>
            </div>
          );
        }

        // Render text block lines & lists
        const lines = block.content.split("\n");

        return (
          <div key={blockIdx} className="space-y-2">
            {lines.map((line, lIdx) => {
              const trimmed = line.trim();
              if (!trimmed) return <div key={lIdx} className="h-1" />;

              // Headings
              if (trimmed.startsWith("### ")) {
                return (
                  <h4 key={lIdx} className="text-sm font-extrabold text-slate-900 dark:text-white pt-2 pb-1 border-b border-slate-200/50 dark:border-slate-800/60">
                    {renderFormattedText(trimmed.replace(/^###\s+/, ""))}
                  </h4>
                );
              }
              if (trimmed.startsWith("## ")) {
                return (
                  <h3 key={lIdx} className="text-base font-extrabold text-slate-900 dark:text-white pt-2 pb-1 border-b border-slate-200/50 dark:border-slate-800/60">
                    {renderFormattedText(trimmed.replace(/^##\s+/, ""))}
                  </h3>
                );
              }
              if (trimmed.startsWith("# ")) {
                return (
                  <h2 key={lIdx} className="text-lg font-extrabold text-slate-900 dark:text-white pt-2 pb-1 border-b border-slate-200/50 dark:border-slate-800/60">
                    {renderFormattedText(trimmed.replace(/^#\s+/, ""))}
                  </h2>
                );
              }

              // Bullet points (- or *)
              if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                return (
                  <div key={lIdx} className="flex items-start gap-2 pl-2 my-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                    <p className="flex-1 text-slate-700 dark:text-slate-200">
                      {renderFormattedText(trimmed.replace(/^[-*]\s+/, ""))}
                    </p>
                  </div>
                );
              }

              // Numbered lists (1., 2., etc.)
              const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
              if (numberedMatch) {
                return (
                  <div key={lIdx} className="flex items-start gap-2 pl-2 my-0.5">
                    <span className="font-mono text-sky-500 font-bold shrink-0 text-[11px]">
                      {numberedMatch[1]}.
                    </span>
                    <p className="flex-1 text-slate-700 dark:text-slate-200">
                      {renderFormattedText(numberedMatch[2])}
                    </p>
                  </div>
                );
              }

              // Regular paragraph line
              return (
                <p key={lIdx} className="text-slate-700 dark:text-slate-200 leading-relaxed">
                  {renderFormattedText(line)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
