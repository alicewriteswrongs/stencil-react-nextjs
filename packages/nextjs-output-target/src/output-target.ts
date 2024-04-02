import type { Config, OutputTargetCustom } from "@stencil/core/internal";
import { emitNextJSComponents } from "./components";
import { OutputTargetNextJS } from "./types";
import { copyHydrateScript } from "./hydrate-script";

export function nextJSOutputTarget(
  outputTarget: OutputTargetNextJS,
): OutputTargetCustom {
  return {
    type: "custom",
    name: "nextjs-component-library",
    validate(_config) {
      // TODO make this real
      //
      // should error if no DCE and if no hydrate
      return outputTarget;
    },
    async generator(config, compilerCtx, buildCtx) {
      const timespan = buildCtx.createTimeSpan(`generate react started`, true);

      await copyHydrateScript(outputTarget);
      await emitNextJSComponents(config, compilerCtx, outputTarget, buildCtx);

      timespan.finish(`generate react finished`);
    },
  };
}
