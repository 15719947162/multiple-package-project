import process from 'process'
import consola from 'consola'
/** 输出错误，结束进程 exit(1)是以失败代码结束，*/
export function errorAndExit(err: Error): never {
  consola.error(err)
  process.exit(1)
}
