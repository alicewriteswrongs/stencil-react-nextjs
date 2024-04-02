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
    reactOutputTarget({
      componentCorePackage: 'stencil-library',
      proxiesFile: '../react-library/lib/components/stencil-generated/index.ts',
      reactServerComponents: true,
    }),
    nextJSOutputTarget({
      componentCorePackage: 'stencil-library',
      outDir: '../nextjs-component-library/src',
      customElementsDir: 'dist',
    }),
  ],
  testing: {
    browserHeadless: 'new',
  },
};
