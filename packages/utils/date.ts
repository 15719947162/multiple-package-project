import moment from 'moment'
const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
const DATE_FORMAT = 'YYYY-MM-DD'

/**
 * @description 格式化日期时间
 * @param { moment.MomentInput } date 时间入参 Date | String
 * @param { String } format 格式化规则
 * @returns  { string }
 * @example
 * 场景1：formatToDateTime(new Date(), 'HH:mm') => 17:43
 * 场景2：formatToDateTime(+new Date(), 'HH:mm') => 17:43
 * 场景3：formatToDateTime('2022/12/12 17:43:09', 'HH:mm') => 17:43
 */
export function formatToDateTime(date = null, format = DATE_TIME_FORMAT) {
  return moment(date).format(format)
}
/**
 * @description 格式化日期
 * @param { moment.MomentInput } date 时间入参 Date | String
 * @param { String } format 格式化规则
 * @returns
 * @example
 * 场景1：formatToDate(new Date(), 'YYYY-MM') => 2022-01
 * 场景2：formatToDate(+new Date()) => 2022-01-28
 * 场景3：formatToDate('2022/01/28 17:43:09', 'MM-DD') => 01-28
 */
export function formatToDate(date = null, format = DATE_FORMAT) {
  return moment(date).format(format)
}
