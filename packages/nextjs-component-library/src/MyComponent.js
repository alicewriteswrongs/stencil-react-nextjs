import { defineCustomElement as defineMyComponent } from 'stencil-library/dist/my-component.js';
import { createReactComponent, reactPropsToStencilHTML, htmlToReactElements } from 'react-helpers'
import { Suspense, lazy } from 'react';

export default function MyComponent (props) {
  // PLACEHOLDER
  const html = "<div>SERVER HTML</div>";

  // TODO add type stuff here (we're going to just output JS to get started)
  const WrappedMyComponent = /*@__PURE__*/createReactComponent(
    'my-component',
    undefined,
    undefined,
    defineMyComponent
  );

  const LazyMyComponent = lazy(async () => {
    // this code will only run on the client
    defineMyComponent();
    return {
      default: WrappedMyComponent
    }
  })

  return <Suspense fallback={renderedHTMLToJSX(html)}><LazyMyComponent /></Suspense>;
}
