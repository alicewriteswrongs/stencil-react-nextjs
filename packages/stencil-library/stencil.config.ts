import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';
import { nextJSOutputTarget } from 'nextjs-output-target';

export const config: Config = {
  namespace: 'stencil-library',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'dist-hydrate-script',
    },
    nextJSOutputTarget({
      componentCorePackage: 'stencil-library',
      outDir: '../nextjs-component-library/src',
      customElementsDir: 'dist/components',
      hydrateScriptDir: 'hydrate',
    }),
  ],
  testing: {
    browserHeadless: 'new',
  },
};
