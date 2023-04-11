import { PKG_NAME, PKG_PREFIX } from '@multiple-package-project/build-constants'
import { buildConfig } from '../build-info'

import type { Module } from '../build-info'

/** used for type generator */
export const pathRewriter = (module: Module) => {
  const config = buildConfig[module]

  return (id: string) => {
    id = id.replaceAll(`${PKG_PREFIX}/css-style`, `${PKG_NAME}/css-style`)
    id = id.replaceAll(`${PKG_PREFIX}/`, `${config.bundle.path}/`)
    return id
  }
}
