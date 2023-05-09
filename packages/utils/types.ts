import { isArray, isObject } from '@vue/shared'
import { isNil } from 'lodash-unified'
export { isBoolean, isNumber } from '@vueuse/core'
export { isVNode } from 'vue'
export const isEmpty = (val: unknown) =>
  (!val && val !== 0) ||
  (isArray(val) && val.length === 0) ||
  (isObject(val) && !Object.keys(val).length)

export const isElement = (e: unknown): e is Element => {
  if (typeof Element === 'undefined') return false
  return e instanceof Element
}

export const isPropAbsent = (prop: unknown): prop is null | undefined => {
  return isNil(prop)
}

export type Arrayable<T> = T | T[]
