import type {
  BuildCtx,
  CompilerCtx,
  ComponentCompilerMeta,
  Config,
  CopyResults,
  OutputTargetDist,
} from "@stencil/core/internal";
import { OutputTargetNextJS } from "./types";
import { dashToPascalCase, normalizePath } from "./utils";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function emitNextJSComponents(
  _config: Config,
  _compilerCtx: CompilerCtx,
  outputTarget: OutputTargetNextJS,
  buildCtx: BuildCtx,
) {
  for (const component of buildCtx.components) {
    // do stuff here
    const lines: string[] = [];

    const pascalName = dashToPascalCase(component.tagName);
    // first add import for the defineCustomElement function for component
    lines.push(
      `import { defineCustomElement as define${pascalName} } from '${normalizePath(
        outputTarget.componentCorePackage!,
      )}/${outputTarget.customElementsDir || "components"}/${component.tagName}.js';`,
    );

    // add import for the utils
    lines.push(
      `import { createReactComponent, reactPropsToStencilHTML, htmlToReactElements } from 'react-helpers'`,
    );

    // add import for React utils
    lines.push(`import { Suspense, lazy } from 'react';`);

    // TODO add import for hydrate app

    lines.push(`
export default function ${pascalName} (props) {
  // PLACEHOLDER
  const html = "<div>SERVER HTML</div>";

  // TODO add type stuff here (we're going to just output JS to get started)
  const Wrapped${pascalName} = /*@__PURE__*/createReactComponent(
    '${component.tagName}',
    undefined,
    undefined,
    define${pascalName}
  );

  const Lazy${pascalName} = lazy(async () => {
    // this code will only run on the client
    define${pascalName}();
    return {
      default: Wrapped${pascalName}
    }
  })

  return Suspense fallback={renderedHTMLToJSX(html)}><LazyMyComponent /></Suspense>;
}
`);
    const componentPath = join(outputTarget.outDir, `${pascalName}.js`);
    await writeFile(componentPath, lines.join("\n"));
  }
}
