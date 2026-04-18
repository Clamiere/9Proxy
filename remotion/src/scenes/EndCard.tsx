import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

export interface EndCardProps {
  /** Brand wordmark (e.g. "kyma-ter"). */
  brand?: string;
  /** URL shown below wordmark. */
  url?: string;
  /** Accent color for the Ψ glyph (and glow). */
  accentColor?: string;
  /** Override glyph shown above wordmark. Defaults to "Ψ". */
  glyph?: string;
}

/**
 * Short, clean end card. Staggered entrance:
 *   1. Background fade-in
 *   2. Glyph spring + scale
 *   3. Wordmark slides up
 *   4. URL appears last
 */
export const EndCard: React.FC<EndCardProps> = ({
  brand = "brand",
  url = "example.com",
  accentColor = "#eab308",
  glyph = "Ψ",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });

  const psiProgress = spring({
    frame: frame - 4,
    fps,
    config: { stiffness: 90, damping: 18, mass: 1 },
    durationInFrames: 28,
  });
  const psiScale = interpolate(psiProgress, [0, 1], [0.7, 1]);
  const psiOpacity = interpolate(psiProgress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const wordProgress = spring({
    frame: frame - 10,
    fps,
    config: { stiffness: 100, damping: 22 },
    durationInFrames: 26,
  });
  const wordY = interpolate(wordProgress, [0, 1], [14, 0]);
  const wordOpacity = interpolate(wordProgress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const urlProgress = spring({
    frame: frame - 16,
    fps,
    config: { stiffness: 110, damping: 24 },
    durationInFrames: 22,
  });
  const urlOpacity = interpolate(urlProgress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const tailFade = interpolate(
    frame,
    [durationInFrames - 6, durationInFrames],
    [1, 0.98],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Derive glow color (fallback to accentColor at 25% alpha)
  const glow = `0 0 60px ${accentColor}40`;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: `rgba(8, 8, 10, ${bgOpacity})`,
        justifyContent: "center",
        alignItems: "center",
        fontFamily:
          '-apple-system, "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif',
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          opacity: tailFade,
        }}
      >
        <div
          style={{
            fontSize: 168,
            fontWeight: 700,
            color: accentColor,
            lineHeight: 1,
            transform: `scale(${psiScale})`,
            opacity: psiOpacity,
            textShadow: glow,
          }}
        >
          {glyph}
        </div>
        <div
          style={{
            fontSize: 84,
            fontWeight: 700,
            color: "#f0f0f0",
            letterSpacing: "-0.025em",
            transform: `translateY(${wordY}px)`,
            opacity: wordOpacity,
          }}
        >
          {brand}
        </div>
        <div
          style={{
            fontSize: 30,
            fontWeight: 500,
            color: "#888",
            letterSpacing: "0.02em",
            opacity: urlOpacity,
          }}
        >
          {url}
        </div>
      </div>
    </AbsoluteFill>
  );
};
