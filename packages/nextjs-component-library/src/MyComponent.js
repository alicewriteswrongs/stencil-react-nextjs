import dynamic from 'next/dynamic'
import { headers } from 'next/headers.js';
import { reactPropsToStencilHTML, htmlToReactElements } from 'react-helpers'

export default async function MyComponent (props) {
  // PLACEHOLDER
  const html = "<div>SERVER HTML</div>";

  const LazyMyComponent = dynamic(async () => import("./MyComponentWrapped.js"), {
    loading: () => <div>damn it</div>
  });

  headers();

  return <LazyMyComponent />;
}
