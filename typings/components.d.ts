import '@vue/runtime-core'

declare module '@vue/runtime-core' {
  /* 组件 */
  export interface GlobalComponents {
    HhbIcon: typeof import('../packages/multiple-package-project')['HhbIcon']
  }
}

export {}
