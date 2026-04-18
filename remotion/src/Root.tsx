import "./index.css";
import { Composition } from "remotion";
import { Main, getTotalFrames } from "./Main";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Main"
        component={Main}
        durationInFrames={getTotalFrames()}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
