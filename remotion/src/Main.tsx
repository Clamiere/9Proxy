import React from "react";
import {
  AbsoluteFill,
  Html5Audio,
  Sequence,
  staticFile,
  useVideoConfig,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { VideoScene, KenBurns } from "./scenes/VideoScene";
import { TextOverlay } from "./scenes/TextOverlay";
import { EndCard } from "./scenes/EndCard";

interface Beat {
  srcTime: number;
  durationSec: number;
  text?: string;
  ken?: KenBurns;
}

/**
 * ~22s video: 7 beats (~18s) + 3s end card
 *
 * Arc: homepage → rankings → programs list → detail → browse grid → submit → github
 */
export const BEATS: Beat[] = [
  // 1. Homepage hero — full page view (zoomSlow, no text)
  { srcTime: 1.0, durationSec: 3.0, ken: "zoomSlow" },
  // 2. Homepage — terminal + rankings visible (zoomIn, text)
  { srcTime: 80.0, durationSec: 2.5, text: "450+ affiliate programs", ken: "zoomIn" },
  // 3. Rankings page — top 3 podium + full table (zoomSlow)
  { srcTime: 100.0, durationSec: 2.8, ken: "zoomSlow" },
  // 4. Program detail — ADP with AGENTS.md section (zoomIn, text)
  { srcTime: 180.0, durationSec: 2.5, text: "Agent-ready data", ken: "zoomIn" },
  // 5. Submit page — form view (zoomSlow, text)
  { srcTime: 300.0, durationSec: 2.5, text: "Search. Compare.", ken: "zoomSlow" },
  // 6. GitHub repo — open source (zoomOut, text)
  { srcTime: 700.0, durationSec: 2.5, text: "Open source. MIT.", ken: "zoomOut" },
];

const END_CARD_PROPS = {
  brand: "OpenAffiliate",
  url: "openaffiliate.dev",
  accentColor: "#22c55e",
  glyph: "A",
};

const FPS = 30;
const CROSSFADE_FRAMES = 12; // 0.4s — smoother transitions
const END_CARD_FRAMES = 90; // 3.0s

export function computeBeatOffsets(fps: number) {
  const frames: Array<{ start: number; dur: number }> = [];
  let cursor = 0;
  for (let i = 0; i < BEATS.length; i++) {
    const dur = Math.round(BEATS[i].durationSec * fps);
    frames.push({ start: cursor, dur });
    cursor = cursor + dur - CROSSFADE_FRAMES;
  }
  const mainEnd = cursor + CROSSFADE_FRAMES;
  return { frames, mainEnd };
}

export function getTotalFrames(): number {
  const { mainEnd } = computeBeatOffsets(FPS);
  return mainEnd + END_CARD_FRAMES;
}

const Crossfade: React.FC<{
  durationInFrames: number;
  fadeIn: boolean;
  fadeOut: boolean;
  children: React.ReactNode;
}> = ({ durationInFrames, fadeIn, fadeOut, children }) => {
  const frame = useCurrentFrame();
  const fadeInOpacity = fadeIn
    ? interpolate(frame, [0, CROSSFADE_FRAMES], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  const fadeOutOpacity = fadeOut
    ? interpolate(
        frame,
        [durationInFrames - CROSSFADE_FRAMES, durationInFrames],
        [1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      )
    : 1;
  const opacity = Math.min(fadeInOpacity, fadeOutOpacity);
  return (
    <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>
  );
};

export const Main: React.FC = () => {
  const { fps } = useVideoConfig();
  const { frames, mainEnd } = computeBeatOffsets(fps);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Html5Audio src={staticFile("music.mp3")} volume={0.72} />

      {BEATS.map((beat, i) => {
        const { start, dur } = frames[i];
        const isFirst = i === 0;
        const isLast = i === BEATS.length - 1;
        return (
          <Sequence
            key={i}
            from={start}
            durationInFrames={dur}
            layout="none"
          >
            <Crossfade
              durationInFrames={dur}
              fadeIn={!isFirst}
              fadeOut={!isLast}
            >
              <VideoScene
                srcTime={beat.srcTime}
                durationInFrames={dur}
                fps={fps}
                ken={beat.ken ?? "none"}
              />
{beat.text ? <TextOverlay text={beat.text} /> : null}
            </Crossfade>
          </Sequence>
        );
      })}

      <Sequence
        from={mainEnd - CROSSFADE_FRAMES}
        durationInFrames={END_CARD_FRAMES + CROSSFADE_FRAMES}
        layout="none"
      >
        <EndCard {...END_CARD_PROPS} />
      </Sequence>
    </AbsoluteFill>
  );
};
