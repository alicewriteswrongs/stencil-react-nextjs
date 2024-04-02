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
const ${wrappedComponentName} = /*@__PURE__*/createReactComponent(
  '${component.tagName}',
  undefined,
  undefined,
  ${defineFunctionName}
);
export default ${wrappedComponentName};
`);
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

  // add import for hydrate app
  lines.push(`import { renderToString } from './hydrate';`);

  lines.push(`
const STYLE_REGEX = /<style.+<\\/style>/;

export default async function ${pascalName} (props) {
  // TODO
  // dynamic insert the right props here
  const rawHTML = '<${component.tagName} name="what!!!"></${component.tagName}>';
  const { html } = await renderToString(rawHTML);

  const styleTag = html.match(STYLE_REGEX)?.[0];

  const templateRegex = new RegExp("<${component.tagName}.+</${component.tagName}>")

  const templateTag = html.match(templateRegex)[0];

  const ${lazyPascalName} = dynamic(() => import("./${wrappedComponentName}.js"), {
    loading: () => htmlToReactElements(
      "<div>" + styleTag + templateTag + "</div>"
    )
  });
  return <${lazyPascalName} />;
}
`);
  const componentPath = join(outputTarget.outDir, `${pascalName}.js`);
  await writeFile(componentPath, lines.join("\n"));
}
