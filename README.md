参考项目：multiple-package-project
项目地址：https://github.com/15719947162/multiple-package-project.git

新建一个项目名称文件夹，在该文件夹下执行
npm install -g pnpm

pnpm init
先全局安pnpm，然后在该文件夹下生成一个package.json文件，
子包的创建
和package.json平级创建一个packages文件，所有的子包都建在packages目录下
我们先创建是三个子包：
components：用于存放所有的组件
css-style：用于存放公共样式、各个组件样式。
utils：用于存放所有公共方法
multiple-package-project:入口包，通常和项目名称相同，所有的子包都通过这个包引入和导出，也是打包时的入口。

根目录的package.json中没有name，version，description等等，这些信息全部在入口包中体现，也将其他子包归置在这个子包下，是我们的根项目作为一个公共的包管理，而所有的打包都在packages下进行

将所有子包package.json中的name前加上@项目名称/，例如：
"name": "@multiple-package-project/components",

"name": "@multiple-package-project/utils",

"name": "@multiple-package-project/css-style",
这样做的目的是为每个子包创建自己的工作空间，子包与子包之间，父包与子包之间都可以相互引用

在根目录创建一个pnpm-workspace.yaml文件
这个文件的作用是定义工作空间的根目录，或者排除工作空间一些目录，默认情况下，包含所有子目录。即使使用了自定义目录位置通配符，根目录下的package目录也总是被包含

创建私有包的目的是为了在发布时不和其他包冲突，私有包和共有包在使用上没有任何区别
例如：如果所有都是公有包，在npm上难免会有很多同名包，当在安装和引用时，就会区分不了你要安装的是哪个包，这就造成了混乱。为了解决这个问题产生了私有包。

安装公共依赖
pnpm i 依赖名词 -w
pnpm i axios -w
pnpm i element-plus -w /*-w表示在根目录下安装*/

pnpm add 包名
pnpm add lodash -w -D /*-D表示安装在开发环境下*/

这句命令的意思是在项目根目录下安装typescript依赖
安装项目内包互相依赖
/*子包之间相互引用*/
pnpm add @multiple-package-project/utils@* -F @multiple-package-project/components
pnpm --filter @multiple-package-project/components add @multiple-package-project/css-style@*

/*子包在父包中引用*/
pnpm add @multiple-package-project/css-style@* -w
命令表示在@multiple-package-project/components项目安装@multiple-package-project/utils，其中的@*通配符表示默认同步最新版本，省去每次都要同步最新版本的问题，安装完成后components的package.json的依赖就有了utils，在components中可以引用和使用。
pnpm使用vite或者vue-cli创建项目
pnpm create vite 项目名称
pnpm create vite examples
pnpm create vue my-vue
在根目录下创建一个能够启动的项目来验证自己搭建的多包管理系统是必要的，在创建的验证项目中的入口文件main.js中引入我们的项目

在验证项目中进行验证
import HHB from '../dist/multiple-package-project'
import '../dist/multiple-package-project/dist/index.css'

app.use(HHB)
项目scss打包
样式子包我们使用gulp+esbuild进行打包，我们所有的子包的命令都在父包的package.json中管理，例如：
"build:css": "pnpm run -C packages/css-style build"
这是项目中样式的打包命令，意思是打包css的命令，执行的是packages/css-style子包中的build命令，
"build": "gulp --require @esbuild-kit/cjs-loader"
"start": "gulp --require @esbuild-kit/cjs-loader -f gulpfile.ts",
子包中的build命令，意思是基于gulp使用@esbuild-kit/cjs-loader进行打包，这个命令会去默认路径下找gulpfile.ts/gulpfile.js文件，然后自动执行配置任务
gulpfile.ts/gulpfile.js文件中一般是一些任务函数，通过管道按照一定的顺序的顺序执行，gulp按照代码执行即可。
gulp的样式插件：
gulp-sass：gulp编译sass的插件，需要和sass插件一起使用
gulp-autoprefixer：用来自动给 css 文件样式添加浏览器前缀。
gulp-clean-css：用来压缩css
gulp-rename：在打包时可以轻松地重命名文件
主要的打包函数，告诉了gulp要执行那些，怎样执行，该函数的大致含义是将平级src中后缀名.scss的文件全部引入，先将.scss文件编译为css文件，然后给css添加浏览器前缀，然后压缩这些css，将这些文件名前加上前缀mmp-，最后创建在对应路径的文件系统上。
pipe管道函数：用于连接转换流（Transform streams）或可写流（Writable streams），意思就是控制流向向，再直白点就是控制执行顺序，执行完之前的才会执行后面的，为什么使用pipe函数，是因为在gulp中，所有的任务，文件的转换全部都是异步的，为了保证执行完之前的任务再执行后面的任务，所以需要使用管道函数，管道函数的使用一般使用在src()和dest()之间，pipe里面插件可以更改文件名，文件内容，元数据等等。
function buildCssStyle() {
  const sass = gulpSass(dartSass)
  const noElPrefixFile = /(index|base|display)/
  return src(path.resolve(__dirname, 'src/*.scss'))
    .pipe(sass.sync())
    .pipe(autoprefixer({ cascade: false }))
    .pipe(
      cleanCSS({}, (details) => {
        consola.success(
          `${chalk.cyan(details.name)}: ${chalk.yellow(
            details.stats.originalSize / 1000
          )} KB -> ${chalk.green(details.stats.minifiedSize / 1000)} KB`
        )
      })
    )
    .pipe(
      rename((path) => {
        if (!noElPrefixFile.test(path.basename)) {
          path.basename = `mpp-${path.basename}`
        }
      })
    )
    .pipe(dest(distFolder))
}
文件复制函数，就是将某一个目录下的一个或几个文件或文件夹，复制到指定的地址
export function copyCssStyleBundle() {
  return src(`./dist/**`).pipe(dest('./dist/multiple-package-project/css-style'))
}
export function copyCssStyleSource() {
  return src(path.resolve(__dirname, 'src/**')).pipe(
    dest(path.resolve('./dist/multiple-package-project/css-style', 'src'))
  )
}
gulpfile.ts/gulpfile.js文件最终会暴露出一个gulp的parallel()或者series()函数，他们是将任务函数和/或组合操作组合成更大的操作，这些操作将按顺序依次执行。我们执行的gulp命令就是执行的这个函数。这个组合操作的大致含义是先将评级的src下的所有文件复制一份到./dist/multiple-package-project/css-style目录下，然后打包，最后再将./dist下的文件复制一份到./dist/multiple-package-project/css-style目录下
export const build = parallel(
  copyCssStyleSource,
  series(buildCssStyle, copyCssStyleBundle)
)
项目js/ts打包
js/ts我们使用gulp+rollup+esbuild进行打包，同样的，我们这个命令也在父包的package.json中管理，例如：
"build": "pnpm run -C internal/build start",
这个命令的意思是执行internal/build目录下package.json中的start命令，在internal/build中package.json的start命令如下
"start": "gulp --require @esbuild-kit/cjs-loader",
"start": "gulp --require @esbuild-kit/cjs-loader -f gulpfile.ts",
这个命令的意思是基于gulp使用@esbuild-kit/cjs-loader进行打包，这个命令会去默认路径下找gulpfile.ts/gulpfile.js文件，然后自动执行配置任务
internal/build目录下gulpfile.ts中的主要函数如下：
export default series(
  withTaskName('clean', () => run('pnpm run clean')),
  withTaskName('createOutput', () => mkdir("/dist/multiple-package-project", { recursive: true })),

  parallel(
    runTask('buildModules'),
    runTask('buildFullBundle'),
    runTask('generateTypesDefinitions'),
    series(
      withTaskName('buildCssStyle', () =>
        run('pnpm run -C packages/theme-chalk build')
      ),
      copyFullStyle
    )
  ),

  parallel(copyTypesDefinitions, copyFiles)
)
这个任务的主要意思试，执行任务clean，清空项目和子包中所有的dist文件夹，执行任务createOutput，异步创建目录路径/dist/multiple-package-project，不管这个路径是否存在，执行任务buildModules，执行任务buildFullBundle，执行任务generateTypesDefinitions，执行任务buildCssStyle打包项目样式文件，执行copyFullStyle，copyTypesDefinitions，copyFiles这三个函数，这三个函数我们后面再看，这个不是很重，函数名称前带有copy，大概就是复制函数，复制某些文件去某个路劲的函数，主要是任务是buildModules，buildFullBundle，generateTypesDefinitions这三个。
export const withTaskName = (name, fn) => Object.assign(fn, { displayName: name })
export const runTask = (name) =>
  withTaskName(`shellTask:${name}`, () =>
    run(`pnpm run start ${name}`, "/internal/build")
  )
  
 runTask('buildModules'),// => run(`pnpm run start buildModules`, "/internal/build")
 runTask('buildFullBundle'),// => run(`pnpm run start buildFullBundle`, "/internal/build")
 runTask('generateTypesDefinitions'),// => run(`pnpm run start generateTypesDefinitions`, "/internal/build")
关键就是run函数了
export const run = async (command, cwd = "/") =>
  new Promise((resolve, reject) => {
    const [cmd, ...args] = command.split(' ')
    const app = spawn(cmd, args, {
      cwd,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    })

    const onProcessExit = () => app.kill('SIGHUP')

    app.on('close', (code) => {
      process.removeListener('exit', onProcessExit)

      if (code === 0) resolve()
      else
        reject(
          new Error(`Command failed. \n Command: ${command} \n Code: ${code}`)
        )
    })
    process.on('exit', onProcessExit)
  })
这个run函数的Promise对象中，我们除去两个进程监听方法，主要的逻辑就是spawn，
spawn是node里的模块child_process中的一个方法，目的是创建一个子进程
run(`pnpm run start buildModules`, "/internal/build")

const run = () = async (command, cwd = "/") =>
  new Promise((resolve, reject) => {
    const [cmd, ...args] = command.split(' ') //  cmd = pnpm     args = ['run','start','buildModules']    cwd = "/internal/build"
    const app = spawn(cmd, args, {
      cwd,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    })
  })
子进程buildModules，buildFullBundle，generateTypesDefinitions其实是三个同名函数，在路径/internal/build/src/tasks目录下，run(`pnpm run start buildModules`, "/internal/build")的意思是执行buildModules子进程，/internal/build是buildModules所在路径，这个目录的完整路径其实是指向/internal/build/gulpfile.ts，意思就是执行/internal/build/gulpfile.ts里的buildModules函数，buildModules已经通过
export * from './src'
这个意思是将src下所有的变量和函数暴露在gulpfile.ts中，所以可以在gulpfile.ts中访问到，buildFullBundle，generateTypesDefinitions也是相同的原理。
那现在关键就在/internal/build/src/tasks路径中的buildModules，buildFullBundle，generateTypesDefinitions函数
import { rollup } from 'rollup'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueMacros from 'unplugin-vue-macros/rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'
import glob from 'fast-glob' //用于快速匹配和筛选文件路径。它可以在Node.js应用程序中使用，支持通配符和正则表达式模式匹配文件和文件夹。
import { epRoot, excludeFiles, pkgRoot } from '@element-plus/build-utils'
import { generateExternal, writeBundles } from '../utils'
import { ElementPlusAlias } from '../plugins/element-plus-alias'
import { buildConfigEntries, target } from '../build-info'

import type { OutputOptions } from 'rollup'

export const buildModules = async () => {
  const input = excludeFiles(
    await glob('**/*.{js,ts,vue}', {
      cwd: pkgRoot,
      absolute: true,
      onlyFiles: true,
    })
  )
  const bundle = await rollup({
    input,
    plugins: [
      ElementPlusAlias(),
      VueMacros({
        setupComponent: false,
        setupSFC: false,
        plugins: {
          vue: vue({
            isProduction: false,
          }),
          vueJsx: vueJsx(),
        },
      }),
      nodeResolve({
        extensions: ['.mjs', '.js', '.json', '.ts'],
      }),
      commonjs(),
      esbuild({
        sourceMap: true,
        target,
        loaders: {
          '.vue': 'ts',
        },
      }),
    ],
    external: await generateExternal({ full: false }),
    treeshake: false,
  })
  await writeBundles(
    bundle,
    buildConfigEntries.map(([module, config]): OutputOptions => {
      return {
        format: config.format,
        dir: config.output.path,
        exports: module === 'cjs' ? 'named' : undefined,
        preserveModules: true,
        preserveModulesRoot: epRoot,
        sourcemap: true,
        entryFileNames: `[name].${config.ext}`,
      }
    })
  )
}

buildModules实现按需加载组件，全局样式文件打包
import path from 'path'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { rollup } from 'rollup'
import commonjs from '@rollup/plugin-commonjs'
import vue from '@vitejs/plugin-vue'
import VueMacros from 'unplugin-vue-macros/rollup'
import vueJsx from '@vitejs/plugin-vue-jsx'
import esbuild, { minify as minifyPlugin } from 'rollup-plugin-esbuild'
import { parallel } from 'gulp'
import glob from 'fast-glob'
import { camelCase, upperFirst } from 'lodash'
import {
  PKG_BRAND_NAME,
  PKG_CAMELCASE_LOCAL_NAME,
  PKG_CAMELCASE_NAME,
} from '@element-plus/build-constants'
import { epOutput, epRoot, localeRoot } from '@element-plus/build-utils'
import { version } from '../../../../packages/element-plus/version'
import { ElementPlusAlias } from '../plugins/element-plus-alias'
import {
  formatBundleFilename,
  generateExternal,
  withTaskName,
  writeBundles,
} from '../utils'
import { target } from '../build-info'
import type { Plugin } from 'rollup'

const banner = `/*! ${PKG_BRAND_NAME} v${version} */\n`

async function buildFullEntry(minify: boolean) {
  const plugins: Plugin[] = [
    ElementPlusAlias(),
    VueMacros({
      setupComponent: false,
      setupSFC: false,
      plugins: {
        vue: vue({
          isProduction: true,
        }),
        vueJsx: vueJsx(),
      },
    }),
    nodeResolve({
      extensions: ['.mjs', '.js', '.json', '.ts'],
    }),
    commonjs(),
    esbuild({
      exclude: [],
      sourceMap: minify,
      target,
      loaders: {
        '.vue': 'ts',
      },
      define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
      },
      treeShaking: true,
      legalComments: 'eof',
    }),
  ]
  if (minify) {
    plugins.push(
      minifyPlugin({
        target,
        sourceMap: true,
      })
    )
  }

  const bundle = await rollup({
    input: path.resolve(epRoot, 'index.ts'),
    plugins,
    external: await generateExternal({ full: true }),
    treeshake: true,
  })
  await writeBundles(bundle, [
    {
      format: 'umd',
      file: path.resolve(
        epOutput,
        'dist',
        formatBundleFilename('index.full', minify, 'js')
      ),
      exports: 'named',
      name: PKG_CAMELCASE_NAME,
      globals: {
        vue: 'Vue',
      },
      sourcemap: minify,
      banner,
    },
    {
      format: 'esm',
      file: path.resolve(
        epOutput,
        'dist',
        formatBundleFilename('index.full', minify, 'mjs')
      ),
      sourcemap: minify,
      banner,
    },
  ])
}

async function buildFullLocale(minify: boolean) {
  const files = await glob(`**/*.ts`, {
    cwd: path.resolve(localeRoot, 'lang'),
    absolute: true,
  })
  return Promise.all(
    files.map(async (file) => {
      const filename = path.basename(file, '.ts')
      const name = upperFirst(camelCase(filename))

      const bundle = await rollup({
        input: file,
        plugins: [
          esbuild({
            minify,
            sourceMap: minify,
            target,
          }),
        ],
      })
      await writeBundles(bundle, [
        {
          format: 'umd',
          file: path.resolve(
            epOutput,
            'dist/locale',
            formatBundleFilename(filename, minify, 'js')
          ),
          exports: 'default',
          name: `${PKG_CAMELCASE_LOCAL_NAME}${name}`,
          sourcemap: minify,
          banner,
        },
        {
          format: 'esm',
          file: path.resolve(
            epOutput,
            'dist/locale',
            formatBundleFilename(filename, minify, 'mjs')
          ),
          sourcemap: minify,
          banner,
        },
      ])
    })
  )
}

export const buildFull = (minify: boolean) => async () =>
  Promise.all([buildFullEntry(minify), buildFullLocale(minify)])

export const buildFullBundle = parallel(
  withTaskName('buildFullMinified', buildFull(true)),
  withTaskName('buildFull', buildFull(false))
)

buildFullBundle实现讲所有的组件和依赖打包成一个文件，通过引入这个完整包，可以完成所有的配置工作
import process from 'process'
import path from 'path'
import { mkdir, readFile, writeFile } from 'fs/promises'
import consola from 'consola'
import * as vueCompiler from 'vue/compiler-sfc'
import glob from 'fast-glob'
import chalk from 'chalk'
import { Project } from 'ts-morph'
import {
  buildOutput,
  epRoot,
  excludeFiles,
  pkgRoot,
  projRoot,
} from '@element-plus/build-utils'
import { pathRewriter } from '../utils'
import type { CompilerOptions, SourceFile } from 'ts-morph'

const TSCONFIG_PATH = path.resolve(projRoot, 'tsconfig.web.json')
const outDir = path.resolve(buildOutput, 'types')

/**
 * fork = require( https://github.com/egoist/vue-dts-gen/blob/main/src/index.ts
 */
export const generateTypesDefinitions = async () => {
  const compilerOptions: CompilerOptions = {
    emitDeclarationOnly: true,
    outDir,
    baseUrl: projRoot,
    preserveSymlinks: true,
    skipLibCheck: true,
    noImplicitAny: false,
  }
  const project = new Project({
    compilerOptions,
    tsConfigFilePath: TSCONFIG_PATH,
    skipAddingFilesFromTsConfig: true,
  })

  const sourceFiles = await addSourceFiles(project)
  consola.success('Added source files')

  typeCheck(project)
  consola.success('Type check passed!')

  await project.emit({
    emitOnlyDtsFiles: true,
  })

  const tasks = sourceFiles.map(async (sourceFile) => {
    const relativePath = path.relative(pkgRoot, sourceFile.getFilePath())
    consola.trace(
      chalk.yellow(
        `Generating definition for file: ${chalk.bold(relativePath)}`
      )
    )

    const emitOutput = sourceFile.getEmitOutput()
    const emitFiles = emitOutput.getOutputFiles()
    if (emitFiles.length === 0) {
      throw new Error(`Emit no file: ${chalk.bold(relativePath)}`)
    }

    const subTasks = emitFiles.map(async (outputFile) => {
      const filepath = outputFile.getFilePath()
      await mkdir(path.dirname(filepath), {
        recursive: true,
      })

      await writeFile(
        filepath,
        pathRewriter('esm')(outputFile.getText()),
        'utf8'
      )

      consola.success(
        chalk.green(
          `Definition for file: ${chalk.bold(relativePath)} generated`
        )
      )
    })

    await Promise.all(subTasks)
  })

  await Promise.all(tasks)
}

async function addSourceFiles(project: Project) {
  project.addSourceFileAtPath(path.resolve(projRoot, 'typings/env.d.ts'))

  const globSourceFile = '**/*.{js?(x),ts?(x),vue}'
  const filePaths = excludeFiles(
    await glob([globSourceFile, '!element-plus/**/*'], {
      cwd: pkgRoot,
      absolute: true,
      onlyFiles: true,
    })
  )
  const epPaths = excludeFiles(
    await glob(globSourceFile, {
      cwd: epRoot,
      onlyFiles: true,
    })
  )

  const sourceFiles: SourceFile[] = []
  await Promise.all([
    ...filePaths.map(async (file) => {
      if (file.endsWith('.vue')) {
        const content = await readFile(file, 'utf-8')
        const hasTsNoCheck = content.includes('@ts-nocheck')

        const sfc = vueCompiler.parse(content)
        const { script, scriptSetup } = sfc.descriptor
        if (script || scriptSetup) {
          let content =
            (hasTsNoCheck ? '// @ts-nocheck\n' : '') + (script?.content ?? '')

          if (scriptSetup) {
            const compiled = vueCompiler.compileScript(sfc.descriptor, {
              id: 'xxx',
            })
            content += compiled.content
          }

          const lang = scriptSetup?.lang || script?.lang || 'js'
          const sourceFile = project.createSourceFile(
            `${path.relative(process.cwd(), file)}.${lang}`,
            content
          )
          sourceFiles.push(sourceFile)
        }
      } else {
        const sourceFile = project.addSourceFileAtPath(file)
        sourceFiles.push(sourceFile)
      }
    }),
    ...epPaths.map(async (file) => {
      const content = await readFile(path.resolve(epRoot, file), 'utf-8')
      sourceFiles.push(
        project.createSourceFile(path.resolve(pkgRoot, file), content)
      )
    }),
  ])

  return sourceFiles
}

function typeCheck(project: Project) {
  const diagnostics = project.getPreEmitDiagnostics()
  if (diagnostics.length > 0) {
    consola.error(project.formatDiagnosticsWithColorAndContext(diagnostics))
    const err = new Error('Failed to generate dts.')
    consola.error(err)
    throw err
  }
}

generateTypesDefinitions实现生成用户类型定义文件，便于用户后期开发使用




