import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface DocsCodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export const DocsCodeBlock: React.FC<DocsCodeBlockProps> = ({
  code,
  language = 'bash',
  title,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden font-mono text-xs">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/80 bg-zinc-900/60">
        <span className="text-[11px] text-zinc-400 font-medium">
          {title || language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-pink-400" />
              <span className="text-pink-400 font-sans">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="font-sans">Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto text-zinc-200 leading-relaxed whitespace-pre font-mono text-[12px]">
        {code}
      </div>
    </div>
  );
};
