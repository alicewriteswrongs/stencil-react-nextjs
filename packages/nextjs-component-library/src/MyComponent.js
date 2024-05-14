import { renderToString } from './hydrate';
import { defineCustomElement as defineMyComponent, MyComponentSC } from 'stencil-library/dist/components/my-component.js';
import { createReactComponent } from 'create-react-component'
import React from 'react'

const MyComponent = typeof globalThis.window !== 'undefined'
    ? createReactComponent({
        tagName: 'my-component',
        elementClass: MyComponentSC,
        react: React,
        events: {},
        defineCustomElement: defineMyComponent
    })
    :
    /**
     * export serialized version of component for server side rendering
     */
    async (props) => {
        const { html } = await renderToString(
            `<my-component first="rendering on the server"></my-button>`
        );
        const templateTag = html.slice(
            html.indexOf('<body>') + '<body>'.length,
            -('</body></html>'.length)
        );
        return (
            <my-component>
                <template suppressHydrationWarning shadowrootmode="open" dangerouslySetInnerHTML={{
                    __html: templateTag
                }} />
            </my-component>
        )
    }

export default MyComponent
