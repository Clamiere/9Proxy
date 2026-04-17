"use client";

import Image from "next/image";

interface ProgramLogoProps {
  slug: string;
  name: string;
  size?: number;
  className?: string;
}

/**
 * Program logo with fallback chain:
 * 1. Local file at /logos/{slug}.png (downloaded by scripts/download-logos.ts)
 * 2. Google Favicon API (128px)
 * 3. First letter initial
 */
export function ProgramLogo({
  slug,
  name,
  size = 40,
  className = "",
}: ProgramLogoProps) {
  const localSrc = `/logos/${slug}.png`;
  const initial = name.charAt(0).toUpperCase();

  return (
    <div
      className={`relative flex items-center justify-center rounded-lg bg-muted text-sm font-bold overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Letter initial as background fallback */}
      <span className="absolute inset-0 flex items-center justify-center select-none">
        {initial}
      </span>
      {/* Image overlay — hides initial when loaded */}
      <Image
        src={localSrc}
        alt={`${name} logo`}
        width={size}
        height={size}
        className="absolute inset-0 object-contain"
        unoptimized
        onError={(e) => {
          // Hide broken image, letter initial shows through
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    </div>
  );
}
