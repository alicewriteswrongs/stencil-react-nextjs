'use client'
import Image from "next/image";
import { MyComponent, defineCustomElements } from "react-library";

defineCustomElements();

export default function Home() {
  return (
    <MyComponent first="Stencil, visiting NextJS!" />
  );
}
