import { resolve } from 'path'

/* 基础包路径 */
export const projRoot = resolve(__dirname, '..', '..', '..') /** ../../../ */
export const pkgRoot = resolve(projRoot, 'packages')  /** ../../../packages */
export const compRoot = resolve(pkgRoot, 'components') /** ../../../packages/components */
export const themeRoot = resolve(pkgRoot, 'css-style') /** ../../../packages/css-style */
export const hookRoot = resolve(pkgRoot, 'hooks') /** ../../../packages/hooks */
export const epRoot = resolve(pkgRoot, 'multiple-package-project') /** ../../../packages/multiple-package-project */
export const utilRoot = resolve(pkgRoot, 'utils') /** ../../../packages/utils */
export const buildRoot = resolve(projRoot, 'internal', 'build') /** ../../../internal/build */

/* 打包路径 */
export const buildOutput = resolve(projRoot, 'dist') /** ../../../dist */
/* 对外包 */
export const epOutput = resolve(buildOutput, 'multiple-package-project') /** ../../../dist/multiple-package-project */

export const projPackage = resolve(projRoot, 'package.json') /** ../../../package.json */
export const compPackage = resolve(compRoot, 'package.json') /** ../../../packages/components/package.json */
export const themePackage = resolve(themeRoot, 'package.json') /** ../../../packages/css-style/package.json */
export const hookPackage = resolve(hookRoot, 'package.json') /** ../../../packages/hooks/package.json */
export const epPackage = resolve(epRoot, 'package.json') /** ../../../packages/multiple-package-project/package.json */
export const utilPackage = resolve(utilRoot, 'package.json') /** ../../../packages/utils/package.json */
