"use client";
import { defineCustomElement as defineMyComponent, MyComponent } from 'stencil-library/dist/components/my-component.js';
import { createReactComponent } from 'create-react-component'
import React from 'react'

// TODO add type stuff here (we're going to just output JS to get started)
const MyComponentWrapped = /*@__PURE__*/createReactComponent({
  tagName: 'my-component',
  elementClass: MyComponent,
  react: React,
  defineCustomElement: defineMyComponent
});
export default MyComponentWrapped;
