import dynamic from 'next/dynamic'
import { reactPropsToStencilHTML, htmlToReactElements } from 'react-helpers'
import { renderToString } from './hydrate';

const STYLE_REGEX = /<style.+<\/style>/;

export default async function MyComponent (props) {
  // TODO
  // dynamic insert the right props here
  const rawHTML = '<my-component first="rendering on the server"></my-component>';
  const { html } = await renderToString(rawHTML);

  const styleTag = html.match(STYLE_REGEX)?.[0];

  const templateRegex = new RegExp("<my-component.*?>(.+)</my-component>")

  const templateTag = html.match(templateRegex)[1];

  const LazyMyComponent = dynamic(() => import("./MyComponentWrapped.js"), {
    loading: () => <my-component suppressHydrationErrors>
      <template shadowrootmode="open" dangerouslySetInnerHTML={{
        __html: styleTag + templateTag
      }} />
    </my-component>,
    ssr: false
  });
  return <LazyMyComponent suppressHydrationErrors {...props} />;
}
