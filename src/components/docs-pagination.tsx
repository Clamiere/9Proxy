import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getAdjacentPages } from "@/app/docs/_config";

export function DocsPagination({ currentPath }: { currentPath: string }) {
  const { prev, next } = getAdjacentPages(currentPath);

  if (!prev && !next) return null;

  return (
    <div className="border-t border-border/30 mt-12 pt-6 flex items-center text-sm font-semibold">
      {prev ? (
        <Link
          href={prev.href}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span>{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link
          href={next.href}
          className="flex items-center gap-2 ml-auto text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>{next.title}</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}
