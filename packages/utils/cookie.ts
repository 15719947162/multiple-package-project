/** Cookie工具 **/

interface CookieObj {
  [key: string]: string
}

/**
 * @description 读取Cookie
 */
export const getCookie = (): CookieObj => {
  const cookies = document.cookie
  return cookies
    ? cookies.split('; ').reduce((t: CookieObj, v) => {
        const cookie = v.split('=')
        t[cookie[0]] = cookie[1]
        return t
      }, {})
    : {}
}

/**
 * @description 删除Cookie
 * @param {string} [key=""] 键
 */
export const removeCookie = (key = ''): void => {
  setCookie(key, '', -1)
}

/**
 * @description 设置Cookie
 * @param {string} [key=""] 键
 * @param {string} [val=""] 值
 * @param {number} [day=1] 过期时间(日)
 */
export const setCookie = (key = '', val: string, day = 1): void => {
  const date = new Date()
  date.setDate(date.getDate() + day)
  document.cookie = `${key}=${val};expires=${date.toString()}`
}
