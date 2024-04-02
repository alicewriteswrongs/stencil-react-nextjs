"use client";
import { defineCustomElement as defineMyComponent } from 'stencil-library/dist/components/my-component.js';
import { createReactComponent } from 'create-react-component'

// TODO add type stuff here (we're going to just output JS to get started)
const MyComponentWrapped = /*@__PURE__*/createReactComponent(
  'my-component',
  undefined,
  undefined,
  defineMyComponent
);
export default MyComponentWrapped;
