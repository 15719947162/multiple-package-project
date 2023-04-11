import { PKG_NAME, PKG_PREFIX } from '@multiple-package-project/build-constants'

import type { Plugin } from 'rollup'

export function GangwAlias(): Plugin {
  const cssStyle = 'css-style'
  const sourceCssStyle = `${PKG_PREFIX}/${cssStyle}` as const
  const bundleCssStyle = `${PKG_NAME}/${cssStyle}` as const

  return {
    name: 'gangw-alias-plugin',
    resolveId(id) {
      if (!id.startsWith(sourceCssStyle)) return
      return {
        id: id.replaceAll(sourceCssStyle, bundleCssStyle),
        external: 'absolute',
      }
    },
  }
}
