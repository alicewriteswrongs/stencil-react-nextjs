import dynamic from 'next/dynamic'
import { reactPropsToStencilHTML, htmlToReactElements } from 'react-helpers'
import { renderToString } from './hydrate';

const STYLE_REGEX = /<style.+<\/style>/;

export default async function MyComponent (props) {
  // TODO
  // dynamic insert the right props here
  const rawHTML = '<my-component name="what!!!"></my-component>';
  const { html } = await renderToString(rawHTML);

  const styleTag = html.match(STYLE_REGEX)?.[0];

  const templateRegex = new RegExp("<my-component.+</my-component>")

  const templateTag = html.match(templateRegex)[0];

  const LazyMyComponent = dynamic(() => import("./MyComponentWrapped.js"), {
    loading: () => <div dangerouslySetInnerHTML={{ __html: styleTag + templateTag }} />
  });
  return <LazyMyComponent />;
}
