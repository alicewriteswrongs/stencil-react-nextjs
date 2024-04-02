import type {
  BuildCtx,
  CompilerCtx,
  ComponentCompilerMeta,
  Config,
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
    const wrappedComponentName = await emitClientComponent(
      outputTarget,
      component,
    );
    await emitServerComponent(outputTarget, component, wrappedComponentName);
  }
}

/**
 * Generate an ESModule containing a client-side only version of the component
 * and write it to disk.
 */
async function emitClientComponent(
  outputTarget: OutputTargetNextJS,
  component: ComponentCompilerMeta,
): Promise<string> {
  const lines: string[] = [];

  const pascalName = dashToPascalCase(component.tagName);
  const wrappedComponentName = `${pascalName}Wrapped`;
  const defineFunctionName = `define${pascalName}`;

  // client component
  lines.push(`"use client";`);

  // first add import for the defineCustomElement function for component
  lines.push(
    `import { defineCustomElement as ${defineFunctionName} } from '${normalizePath(
      outputTarget.componentCorePackage!,
    )}/${outputTarget.customElementsDir || "components"}/${component.tagName}.js';`,
  );

  // add import for the createReactComponent
  lines.push(`import { createReactComponent } from 'create-react-component'`);

  lines.push(`
// TODO add type stuff here (we're going to just output JS to get started)
export default ${wrappedComponentName} = /*@__PURE__*/createReactComponent(
  '${component.tagName}',
  undefined,
  undefined,
  ${defineFunctionName}
);`);
  const modulePath = join(outputTarget.outDir, `${wrappedComponentName}.js`);
  await writeFile(modulePath, lines.join("\n"));
  return wrappedComponentName;
}

async function emitServerComponent(
  outputTarget: OutputTargetNextJS,
  component: ComponentCompilerMeta,
  wrappedComponentName: string,
) {
  const lines: string[] = [];

  const pascalName = dashToPascalCase(component.tagName);
  const lazyPascalName = `Lazy${pascalName}`;

  // add import for next.js 'dynamic' function
  // see https://nextjs.org/docs/pages/building-your-application/optimizing/lazy-loading#nextdynamic
  lines.push(`import dynamic from 'next/dynamic'`);
  // add import for our helpers
  lines.push(
    `import { reactPropsToStencilHTML, htmlToReactElements } from 'react-helpers'`,
  );

  // TODO add import for hydrate app
  lines.push(`
export default async function ${pascalName} (props) {
  // PLACEHOLDER
  const html = "<div>SERVER HTML</div>";

  const ${lazyPascalName} = dynamic(() => import("./${wrappedComponentName}.js"), {
    loading: () => renderedHTMLToJSX(html)
  });
  return <${lazyPascalName} />;
}
`);
  const componentPath = join(outputTarget.outDir, `${pascalName}.js`);
  await writeFile(componentPath, lines.join("\n"));
}
