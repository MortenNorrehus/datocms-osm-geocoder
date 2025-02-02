import type { RenderConfigScreenCtx } from "datocms-plugin-sdk";
import { Canvas } from "datocms-react-ui";

type Props = {
  ctx: RenderConfigScreenCtx;
};

export default function ConfigScreen({ ctx }: Props) {
  return (
    <Canvas ctx={ctx}>
      <p>This plugin does not have any settings</p>
    </Canvas>
  );
}
