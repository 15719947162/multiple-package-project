import { buildRoot } from '@multiple-package-project/build-utils'
import { run } from './process'

import type { TaskFunction } from 'gulp'

export const withTaskName = <T extends TaskFunction>(name: string, fn: T) =>
  Object.assign(fn, { displayName: name })

export const runTask = (name: string) =>
  withTaskName(`shellTask:${name}`, () =>
    run(`pnpm run start ${name}`, buildRoot)
  )


// runTask('buildModules')
// withTaskName(`shellTask:buildModules`, () =>
//   run(`pnpm run start buildModules`, "../../../internal/build")
// )

// runTask('buildFullBundle')
// withTaskName(`shellTask:buildFullBundle`, () =>
//   run(`pnpm run start buildFullBundle`, "../../../internal/build")
// )

// runTask('generateTypesDefinitions')
// withTaskName(`shellTask:generateTypesDefinitions`, () =>
//   run(`pnpm run start generateTypesDefinitions`, "../../../internal/build")
// )

// withTaskName('buildThemeChalk', () =>
//   run('pnpm run -C packages/theme-chalk build')
// ),

const run = async (command, cwd = projRoot) =>
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