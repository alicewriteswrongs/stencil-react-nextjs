// TODO fix any here
export function reactPropsToStencilHTML(tagName: string, _props: any) {
  // TODO actually transform the props here
  const propsAsAttrs = `name="TEST NAME"`;

  // TODO figure out handling children here
  return `<${tagName} ${propsAsAttrs}></${tagName}>`;
}
