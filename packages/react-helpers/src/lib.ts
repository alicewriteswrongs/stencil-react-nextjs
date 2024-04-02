import * as htmlparser2 from "htmlparser2";
import type { Element } from "domhandler";
import { createElement } from "react";

/**
 * Given a snippet of HTML return a tree of calls to the React `createElement`
 * function. This basically replicates how JSX is transpiled w/ a tool like
 * Babel, but does it dynamically at runtime based on an HTML snippet instead of
 * some JS code.
 */
export function htmlToReactJSX(html: string) {
  const document = htmlparser2.parseDocument(html);
  // that should produce a 'root' document with one child (the outermost tag of the snippet)
  // we can make some assumptions here because of the constraints that we know
  // Stencil places on how it renders (i.e. one root element).
  const root = document.children[0] as Element;
  return elToReactElement(root);
}

function elToReactElement(el: Element): ReturnType<typeof createElement> {
  return createElement(
    el.name,
    // TODO transform props here
    { name: "Test Name" },
    el.children.map((child) => elToReactElement(child as Element)),
  );
}

// TODO fix any here
export function reactPropsToStencilHTML(tagName: string, _props: any) {
  // TODO actually transform the props here
  const propsAsAttrs = `name="TEST NAME"`;

  // TODO figure out handling children here
  return `<${tagName} ${propsAsAttrs}></${tagName}>`;
}
