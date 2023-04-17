import { camelize, isObject, isString } from '@vue/shared'
import { isClient, isNumber } from '@vueuse/core'
import { debugWarn } from './error'

const SCOPE = 'utils/dom'

/* ==============================事件类================================== */
/* istanbul ignore next */
/**
 * @description 绑定事件
 * @param { HTMLElement | Document | Window } element 绑定事件元素对象
 * @param { String } event 事件名称
 * @param {EventListenerOrEventListenerObject } handler 事件函数
 * @param { Boolean } useCapture 指定事件是否在捕获或冒泡阶段执行 true(捕获) false(冒泡)
 * @example  on(ctx.$el, 'click', funName)
 */
// eslint-disable-next-line prettier/prettier
export const on = function (
  element: Element,
  event: string,
  handler: EventListenerOrEventListenerObject,
  useCapture = false
) {
  if (element && event && handler) {
    element?.addEventListener(event, handler, useCapture)
  }
}
/**
 * @description 解绑事件
 * @param { HTMLElement | Document | Window } element 绑定事件元素对象
 * @param { String } event 事件名称
 * @param { EventListenerOrEventListenerObject } handler 事件函数
 * @param { Boolean } useCapture 指定事件是否在捕获或冒泡阶段执行 true(捕获) false(冒泡)
 * @example  off(ctx.$el, 'click', funName)
 */
// eslint-disable-next-line prettier/prettier
export const off = function (
  element: Element,
  event: string,
  handler: EventListenerOrEventListenerObject,
  useCapture = false
) {
  if (element && event && handler) {
    element?.removeEventListener(event, handler, useCapture)
  }
}
/**
 * @description 绑定事件仅绑定一次
 * @param {HTMLElement} el 绑定事件元素对象
 * @param {String} event 事件名称
 * @param {EventListener} fn 事件函数
 * @example once(ctx.$el, 'click', funName);
 */
// eslint-disable-next-line prettier/prettier
export const once = function (
  el: HTMLElement,
  event: string,
  fn: EventListener
) {
  const listener = function (that: any, ...args: any) {
    fn && fn.apply(that, args)
    off(el, event, listener)
  }
  on(el, event, listener)
}
/* ==============================css 样式=============================== */
/**
 * @description 将带有空格符的字符串处理成数组
 * @param { String } s
 * @returns { Array } 新数组
 */
const trimArr = function (s: string) {
  return (s || '').split(' ').filter((item: string) => !!item.trim())
}
/**
 * @description 判断某个元素是不是包含指定的calssName
 * @param {HTMLElement | Element} el
 * @param { String } cls
 * @returns { Boolean } true|false
 * @example hasClass(ctx.$el, 'home') => true | false
 */
// eslint-disable-next-line prettier/prettier
export function hasClass(el: HTMLElement, cls: string) {
  if (!el || !cls) return false
  if (cls.includes(' ')) throw new Error('className should not contain space.')
  if (el.classList) {
    return el.classList.contains(cls)
  } else {
    const className = el.getAttribute('class') || ''
    return className.split(' ').includes(cls)
  }
}

/**
 * @description 为某个元素对象添加className
 * @param { HTMLElement | Element } el 元素对象
 * @param { String } cls  class样式名称
 * @returns
 * @example
 * 原元素 <div class="home"></div>
 * addClass(ctx.$el, 'cls1 cls2') => <div class="home cls1 cls2"></div>
 */
// eslint-disable-next-line prettier/prettier
export function addClass(el: HTMLElement, cls: string) {
  if (!el) return
  let className = el.getAttribute('class') || ''
  const curClass = trimArr(className)
  const classes = (cls || '')
    .split(' ')
    .filter((item) => !curClass.includes(item) && !!item.trim())

  if (el.classList) {
    el.classList.add(...classes)
  } else {
    className += ` ${classes.join(' ')}`
    el.setAttribute('class', className)
  }
}
/**
 * @description 为某个元素对象移除className
 * @param { HTMLElement | Element } el 元素对象
 * @param {String } cls class样式名称
 * @returns
 * @example
 * 原元素 <div class="home home1 home6 home2 home5"></div>
 * removeClass(ctx.$el, 'home5 home2') =>  <div class="home home1 home6"></div>
 */
// eslint-disable-next-line prettier/prettier
export function removeClass(el: HTMLElement, cls: string) {
  if (!el || !cls) return
  const classes = trimArr(cls)
  let curClass = el.getAttribute('class') || ''

  if (el.classList) {
    el.classList.remove(...classes)
    return
  }
  classes.forEach((item: any) => {
    curClass = curClass.replace(` ${item} `, ' ')
  })
  const className = trimArr(curClass).join(' ')
  el.setAttribute('class', className)
}

/**
 * @description 获取指定元素对象的 style 样式
 * @param { HTMLElement } element 元素对象
 * @param {String } styleName 样式字段
 * @returns
 * @example
 * 场景1：内嵌式 => <div class="home" :style="{ 'font-size': '30px' }"></div>  => getStyle(ctx.$el, 'fontSize') => 30px
 * 场景2：定义css样式 => <div class="home"></div> && .home {font-size: 14px; ...} => getStyle(ctx.$el, 'fontSize') => 14px
 * 场景3：未定义css样式 => <div></div> => getStyle(ctx.$el, 'fontSize') => 16px 获取继承样式
 */
// eslint-disable-next-line prettier/prettier
export const getStyle = function (element: HTMLElement, styleName: any) {
  if (!isClient) return ''
  if (!element || !styleName) return ''
  styleName = camelize(styleName)
  if (styleName === 'float') {
    styleName = 'cssFloat'
  }
  try {
    const style = element.style[styleName]
    if (style) return style
    const computed = document.defaultView?.getComputedStyle(element, '')
    return computed ? computed[styleName] : ''
  } catch {
    return element.style[styleName]
  }
}
/**
 * @description 设置元素的样式，可以设置单个样式属性、值及样式组合对象
 * @param { HTMLElement } element 元素对象
 * @param { CSSProperties | String } styleName 样式对象|字段
 * @param { String || '' } value 样式值
 * @returns
 * @example
 * 原元素 <div class="home"> => setStyle(ctx.$el, 'font-size', '14px') => <div style="font-size: 14px;">
 * 原元素 <div> => setStyle(ctx.$el, { color: '#ff0000', 'backgroud-color': '#f5f5f5', padding: '8px'}) => <div style="font-size: 14px; color: rgb(255, 0, 0); padding: 8px;">
 */
// eslint-disable-next-line prettier/prettier
export function setStyle(element: HTMLElement, styleName: any, value: string) {
  if (!element || !styleName) return

  if (isObject(styleName)) {
    Object.keys(styleName).forEach((prop) => {
      setStyle(element, prop, styleName[prop])
    })
  } else {
    styleName = camelize(styleName)
    element.style[styleName] = value
  }
}
/**
 * @description 移除元素的样式属性及值
 * @param { HTMLElement } element
 * @param { CSSProperties | String } style
 * @returns
 * @example
 * removeStyle(ctx.$el, 'font-size')
 * removeStyle(ctx.$el, { 'background-color': '#f5f5f5', color: '#ff0000' });
 *
 */
// eslint-disable-next-line prettier/prettier
export function removeStyle(element: HTMLElement, style: any) {
  if (!element || !style) return
  if (isObject(style)) {
    Object.keys(style).forEach((prop) => {
      setStyle(element, prop, '')
    })
  } else {
    setStyle(element, style, '')
  }
}

export function addUnit(value?: string | number, defaultUnit = 'px') {
  if (!value) return ''
  if (isString(value)) {
    return value
  } else if (isNumber(value)) {
    return `${value}${defaultUnit}`
  }
  debugWarn(SCOPE, 'binding value must be a string or number')
}
