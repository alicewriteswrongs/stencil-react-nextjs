import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';

export const config: Config = {
  namespace: 'stencil-library',
  outputTargets: [
    {
      type: 'dist-custom-elements',
    },
    reactOutputTarget({
      componentCorePackage: 'stencil-library',
      proxiesFile: '../react-library/lib/components/stencil-generated/index.ts',
      includeImportCustomElements: true,
    }),
  ],
  testing: {
    browserHeadless: "new",
  },
};
