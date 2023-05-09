/** Storage工具 **/

/**
 * @description 清空Local Storage
 */
export const clearLStorage = (): void => {
  localStorage.clear()
}

/**
 * @description 清空Session Storage
 */
export const clearSStorage = (): void => {
  sessionStorage.clear()
}

/**
 * @description 读取Local Storage
 * @param {String} key
 * @returns
 */
export const getLStorage = <T>(key = ''): T => {
  const item = localStorage.getItem(key)
  return item ? JSON.parse(item) : null
}

/**
 * @description 读取session Storage
 * @param  {String} key
 * @returns
 */
export const getSStorage = <T>(key = ''): T => {
  const item = sessionStorage.getItem(key)
  return item ? JSON.parse(item) : null
}

/**
 * @description 删除LocalStorage
 * @param {String} [key=""] 键
 */
export const removeLStorage = (key = ''): void => {
  localStorage.removeItem(key)
}

/**
 * @description 删除SessionStorage
 * @param {String} [key=""] 键
 */
export const removeSStorage = (key = ''): void => {
  sessionStorage.removeItem(key)
}

/**
 * @description 设置LocalStorage
 * @param {string} [key=""] 键
 * @param {string} [val=""] 值
 */
export const setLStorage = <T>(key: string, val: T): void => {
  key && localStorage.setItem(key, JSON.stringify(val))
}

/**
 * @description 设置SessionStorage
 * @param {String} [key=""] 键
 * @param {String} [val=""] 值
 */
export const setSStorage = <T>(key: string, val: T): void => {
  key && sessionStorage.setItem(key, JSON.stringify(val))
}
