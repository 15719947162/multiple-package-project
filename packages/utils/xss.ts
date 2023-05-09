/**
 * @description 过滤XSS
 * @param {string} [html=""] HTML内容
 */
export const filterXss = (html?: string): string => {
  const elem = document.createElement('div')
  elem.innerText = html || ''
  const result = elem.innerHTML
  return result
}
