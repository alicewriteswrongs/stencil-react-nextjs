import { OutputTargetNextJS } from "./types";
import { copyFile, mkdir } from "fs/promises";
import { join } from "path";

export async function copyHydrateScript(outputTarget: OutputTargetNextJS) {
  const hydrateOutputPath = join(outputTarget.outDir, "hydrate");

  try {
    await mkdir(hydrateOutputPath);
  } catch (_) {}

  await copyFile(
    join(outputTarget.hydrateScriptDir, "index.js"),
    join(hydrateOutputPath, "index.js"),
  );
  await copyFile(
    join(outputTarget.hydrateScriptDir, "index.d.ts"),
    join(hydrateOutputPath, "index.d.ts"),
  );
}
