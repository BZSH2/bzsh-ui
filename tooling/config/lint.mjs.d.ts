/* eslint-disable no-unused-vars */

export declare const workspaceIgnores: string[]
export declare const eslintJavaScriptFiles: string[]
export declare const eslintTypeScriptFiles: string[]
export declare const eslintVueFiles: string[]
export declare const stylelintVueLikeFiles: string[]
export declare const stylelintScssFiles: string[]
export declare const rootLintTargets: {
  eslint: string[]
  stylelint: string[]
}
export declare const rootLintIgnorePatterns: string[]
export declare const lintStagedPatterns: Record<
  string,
  string[] | ((_files: string[]) => string | string[])
>
