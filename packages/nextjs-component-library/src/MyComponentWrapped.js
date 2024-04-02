"use client";
import { defineCustomElement as defineMyComponent } from 'stencil-library/dist/components/my-component.js';
// import { createReactComponent } from 'react-helpers'

import { useEffect } from 'react'

export default function Test() {
  useEffect(() => {
    console.log("a");
  }, []);

  return <h1>no no no</h1>
}

// // TODO add type stuff here (we're going to just output JS to get started)
// export default MyComponentWrapped = /*@__PURE__*/createReactComponent(
//   'my-component',
//   undefined,
//   undefined,
//   defineMyComponent
// );
