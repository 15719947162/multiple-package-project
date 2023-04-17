import {
  NOOP,
  extend,
  hasOwn,
  isArray,
  isDate,
  isFunction,
  isObject,
  isPromise,
  isString,
  isSymbol,
  toRawType,
} from '@vue/shared'
const isBool = (val: any) => typeof val === 'boolean'

const isHTMLElement = (val: unknown) => toRawType(val).startsWith('HTML')

const isUndefined = (val: any): val is undefined => val === undefined

export {
  NOOP,
  extend,
  hasOwn,
  isArray,
  isObject,
  isString,
  isFunction,
  isPromise,
  isDate,
  isSymbol,
  toRawType,
  isBool,
  isHTMLElement,
  isUndefined,
}
