import { createElement, useEffect, useRef } from 'react';

import { attachProps, camelToDashCase, createForwardRef, dashToPascalCase, isCoveredByReact, mergeRefs } from './utils';

export interface HTMLStencilElement extends HTMLElement {
  componentOnReady(): Promise<this>;
}

interface StencilReactInternalProps<ElementType> extends React.HTMLAttributes<ElementType> {
  forwardedRef: React.RefObject<ElementType>;
  ref?: React.Ref<any>;
}

export const oldcreateReactComponent = <
  PropType,
  ElementType extends HTMLStencilElement,
  ContextStateType = {},
  ExpandedPropsTypes = {}
>(
  tagName: string,
  ReactComponentContext?: React.Context<ContextStateType>,
  manipulatePropsFunction?: (
    originalProps: StencilReactInternalProps<ElementType>,
    propsToPass: any
  ) => ExpandedPropsTypes,
  defineCustomElement?: () => void
) => {
  if (defineCustomElement !== undefined) {
    defineCustomElement();
  }

  const displayName = dashToPascalCase(tagName);
  function ReactComponent (props: StencilReactInternalProps<ElementType>) {
    const componentElRef = useRef(null);

    useEffect(() => {
      // TODO figure out old props
      if (componentElRef.current) {
        attachProps(componentElRef.current, props, props);
      }
    }, [ props, componentElRef ]);


    const { children, forwardedRef, style, className, ref, ...cProps } = props;

    let propsToPass = Object.keys(cProps).reduce((acc: any, name) => {
      const value = (cProps as any)[name];

      if (name.indexOf('on') === 0 && name[2] === name[2].toUpperCase()) {
        const eventName = name.substring(2).toLowerCase();
        if (typeof document !== 'undefined' && isCoveredByReact(eventName)) {
          acc[name] = value;
        }
      } else {
        // we should only render strings, booleans, and numbers as attrs in html.
        // objects, functions, arrays etc get synced via properties on mount.
        const type = typeof value;

        if (type === 'string' || type === 'boolean' || type === 'number') {
          acc[camelToDashCase(name)] = value;
        }
      }
      return acc;
    }, {} as ExpandedPropsTypes);

    if (manipulatePropsFunction) {
      propsToPass = manipulatePropsFunction(props, propsToPass);
    }

    const newProps: Omit<StencilReactInternalProps<ElementType>, 'forwardedRef'> = {
      ...propsToPass,
      ref: mergeRefs(forwardedRef, el => componentElRef.current = el),
      style,
    };

    /**
     * We use createElement here instead of
     * React.createElement to work around a
     * bug in Vite (https://github.com/vitejs/vite/issues/6104).
     * React.createElement causes all elements to be rendered
     * as <tagname> instead of the actual Web Component.
     */
    return createElement(tagName, newProps, children);

  };

  // If context was passed to createReactComponent then conditionally add it to the Component Class
  if (ReactComponentContext) {
    ReactComponent.contextType = ReactComponentContext;
  }

  return createForwardRef<PropType, ElementType>(ReactComponent, displayName);
};




import type { EventName } from '@lit/react';
import { createComponent as createComponentWrapper, Options } from '@lit/react';

export const createReactComponent = <T extends HTMLElement, E extends Record<string, EventName | string>>({ defineCustomElement, ...options }: Options<T, E> & { defineCustomElement: () => void }) => {
    if (typeof defineCustomElement !== 'undefined') {
        defineCustomElement();
    }
    return createComponentWrapper<T, E>(options);
};

