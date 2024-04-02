export interface OutputTargetNextJS {
  componentCorePackage: string;
  // TODO add support for this
  // excludeComponents?: string[];
  customElementsDir: string;
  /**
   * Directory where the hydrate script is
   *
   */
  hydrateScriptDir: string;
  // the directory where the finished component wrappers
  // should be written
  outDir: string;
}
