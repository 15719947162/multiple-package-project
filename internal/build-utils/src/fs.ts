import { existsSync } from 'fs' /** node.js操作文件的模块 */
import { mkdir, writeFile } from 'fs/promises'

/**
 * existsSync 判断文件是否存在，存在则返回 true，否则返回 false
 * mkdir 异步创建目录
 * writeFile 当 file 是文件名时，将数据异步地写入文件，如果文件已存在则替换该文件。当 file 是文件描述符时，其行为类似于直接调用 fs.write()
 */

export const writeJson = (path: string, data: any, spaces = 0) =>
  writeFile(path, JSON.stringify(data, undefined, spaces), 'utf-8')

export const ensureDir = async (path: string) => {
  if (!existsSync(path)) await mkdir(path, { recursive: true })
}
