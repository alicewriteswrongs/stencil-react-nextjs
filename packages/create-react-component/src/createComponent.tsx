import type { EventName } from '@lit/react';
import { createComponent as createComponentWrapper, Options } from '@lit/react';

export const createReactComponent = <T extends HTMLElement, E extends Record<string, EventName | string>>({ defineCustomElement, ...options }: Options<T, E> & { defineCustomElement: () => void }) => {
    if (typeof defineCustomElement !== 'undefined') {
        defineCustomElement();
    }
    return createComponentWrapper<T, E>(options);
};

