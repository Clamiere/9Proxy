import { CopyButton } from "@/components/copy-button";

export function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div className="rounded-2xl bg-muted/60 dark:bg-zinc-950 border border-border/50 overflow-hidden">
      {label && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-border/30 bg-muted/30">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wide">
            {label}
          </span>
          <CopyButton text={code} />
        </div>
      )}
      <div className="relative">
        <pre className="py-3.5 px-4 overflow-x-auto text-sm font-mono text-emerald-700 dark:text-emerald-400 leading-6">
          <code>{code}</code>
        </pre>
        {!label && (
          <div className="absolute top-2.5 right-3">
            <CopyButton text={code} />
          </div>
        )}
      </div>
    </div>
  );
}
