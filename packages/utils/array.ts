import type { ArrayItem } from './types'
import { SystemColor } from './enum'
import { filters } from 'lodash'
/*
* 根据传进来的数组和key，重新组装成新的key数组
*/
export const packageKeys = (arr: Array<ArrayItem>, key: string): Array<string> => {
    const idArr: Array<string> = [];
    arr.forEach((item: ArrayItem, index: number) => {
        idArr.push(item[key])
    })
    return idArr
}

/**
 * 按条件过滤数组
 */
export const filterArr = (arr: Array<ArrayItem>, func: Function): Array<ArrayItem> => {
    return filters(arr, func);
}

/**
 * 从枚举中获取颜色
 */
export const findColor = (key: string): string => {
    return SystemColor[key]
}