import * as htmlparser2 from "htmlparser2";
import type { Element, Text } from "domhandler";
import { createElement } from "react";

/**
 * Given a snippet of HTML return a tree of calls to the React `createElement`
 * function. This basically replicates how JSX is transpiled w/ a tool like
 * Babel, but does it dynamically at runtime based on an HTML snippet instead of
 * some JS code.
 */
export function htmlToReactElements(html: string) {
  const document = htmlparser2.parseDocument(html);
  // that should produce a 'root' document with one child (the outermost tag of the snippet)
  // we can make some assumptions here because of the constraints that we know
  // Stencil places on how it renders (i.e. one root element).
  const root = document.children[0] as Element;
  return elToReactElement(root);
}

// TODO need to sort out _something_ in here which has to do with comments I think
function elToReactElement(
  el: Element | null,
): ReturnType<typeof createElement> | string | null {
  if (!el) {
    return null;
  }
  // if it's a text child
  // @ts-ignore
  if (el.type === "text") {
    return (el as unknown as Text).data;
  }

  // @ts-ignore
  if (el?.type === "comment") {
    return null;
  }

  if (!el.name) {
    console.log(el);
    return null;
  }

  // this is one of the reasons we want to transform the HTML into React
  // elements
  const attributes = {
    suppressHydrationWarning: true,
  };
  el.attributes?.map((attr) => {
    attributes[attr.name] = attr.value;
  });

  return createElement(
    el.name,
    // TODO transform props here
    attributes,
    // children may be undefined
    handleChildren(el),
  );
}

function handleChildren(
  el: Element,
): null | ReturnType<typeof createElement>[] | string {
  if (!el.children) {
    return null;
  }

  if (el.children.length === 1 && el.children[0].type === "text") {
    return (el.children[0] as unknown as Text).data;
  }

  // @ts-ignore
  return el.children.map((child) => elToReactElement(child as Element));
}
