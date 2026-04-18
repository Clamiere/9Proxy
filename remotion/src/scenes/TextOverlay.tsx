import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

export interface TextOverlayProps {
  text: string;
  /** Frame (within this Sequence) at which the text springs in. */
  enterFrame?: number;
  /** Frames before Sequence end at which fade-out starts. */
  exitFramesBeforeEnd?: number;
}

/**
 * Premium text overlay: large, bottom-left, spring-in with subtle translateY,
 * soft drop-shadow, Apple-keynote style.
 */
export const TextOverlay: React.FC<TextOverlayProps> = ({
  text,
  enterFrame = 6,
  exitFramesBeforeEnd = 12,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Spring-in translateY (26px → 0) and opacity (0 → 1)
  const progress = spring({
    frame: frame - enterFrame,
    fps,
    config: { stiffness: 110, damping: 20, mass: 0.9 },
    durationInFrames: 22,
  });
  const translateY = interpolate(progress, [0, 1], [26, 0]);
  const enterOpacity = interpolate(progress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade out
  const exitStart = durationInFrames - exitFramesBeforeEnd;
  const exitOpacity = interpolate(
    frame,
    [exitStart, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const opacity = Math.min(enterOpacity, exitOpacity);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "flex-start",
        padding: "0 0 120px 96px",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          color: "#f5f5f5",
          fontSize: 76,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          fontFamily:
            '-apple-system, "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif',
          textShadow: "0 2px 14px rgba(0,0,0,0.55), 0 1px 2px rgba(0,0,0,0.8)",
          lineHeight: 1.05,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
