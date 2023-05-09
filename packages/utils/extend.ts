/* 工具库扩展 */
import REGXS from './regex'
/**
 * @description 多维数组扁平化
 * @param {Array} arrs
 * @returns
 * demo flatten([[{name:"zs",age:"21"}],[{name:"ls",age:"23"}]]
 */
export const flatten = (arrs: any[]) => {
  let result: any[] = []
  for (const arr of arrs) {
    if (Array.isArray(arr)) {
      result = result.concat(flatten(arr))
    } else {
      result.push(arr)
    }
  }
  return result
}

/**
 * @description 去除字符串前后空格
 * @param { String } str 待去除值
 * @param {Number|String } type 1-所有空格  2-前后空格  3-前空格 4-后空格
 * @returns 返回去除空格后的值
 * demo  trim(' 123 444 ') => "123 444"
 */
export const trim = (str: string, type: number | string = 2) => {
  switch (type) {
    case 1:
      return str.replace(/\s+/g, '')
    case 2:
      return str.replace(/(^\s*)|(\s*$)/g, '')
    case 3:
      return str.replace(/(^\s*)/g, '')
    case 4:
      return str.replace(/(\s*$)/g, '')
    default:
      return str
  }
}
/**
 * @description 根据Key获取URL参数中对用的Value
 * @param { String } name  Key值
 * @returns 返回获取获取值,获取不到返回undefined
 * demo url地址 http://192.168.2.16:8399/index.html?id=10002545&type=student
 * demo getUrlParam ('id') => "10002545"
 */
export const getUrlParam = (name: string) => {
  const reg = new RegExp(`(^|&?)${name}=([^&]*)(&|$)`, 'i')
  const r = window.location.href.slice(1).match(reg)
  if (r != null) {
    return decodeURI(r[2])
  }
  return undefined
}
/**
 * @description Url参数序列化
 * @returns { Object }
 * demo http://192.168.2.16:8399/index.html?id=10002545&type=student
 * demo getQueryUrl() => {id: "10002545", type: "student"}
 */
export const getQueryUrl = () => {
  const currentPageUrl = location.href
  if (!currentPageUrl.includes('?')) return {}
  const params = currentPageUrl.split('?')[1].split('&')
  // eslint-disable-next-line prefer-const
  let obj: any = {}
  params.map((v) => (obj[v.split('=')[0]] = v.split('=')[1]))
  return obj
}

/**
 * @description 获取文件后缀名
 * @param { String } fileName
 * @returns { String }
 * demo getExt("112.jpge") ==> 'jpge'
 */
export const getExtName = (fileName: string) => {
  if (typeof fileName === 'string') {
    const name: any = fileName.split('.').pop()
    return name.toLowerCase()
  } else {
    // eslint-disable-next-line unicorn/prefer-type-error
    throw new Error('文件名称必须是字符串类型')
  }
}

/**
 * @description 脱敏手机
 * @param {String} phone 手机
 * @returns { String }
 * demo desePhone('13488888888') => 134****8888
 */
export const desePhone = (phone = '') => {
  return REGXS.regxPhone.test(phone)
    ? phone.toString().replace(/(\d{3})\d*(\d{4})/g, '$1****$2')
    : phone
}

/**
 * @description 格式手机
 * @param {string} phone 手机
 * @param {string} sign 标记：-、\s
 * @returns { String }
 * demo formatPhone('13488888888') => 134-8888-8888
 */
export const formatPhone = (phone = '', sign = '-') => {
  return REGXS.regxPhone.test(phone) && ['-', ' '].includes(sign)
    ? phone.toString().replace(/(\d{3})(\d{4})(\d{4})/g, `$1${sign}$2${sign}$3`)
    : phone
}
/**
 * @description 格式手机
 * @param { String | Number } amount
 * @param {Number} digits  小数点位数，默认为0
 * @returns
 * demo formatMoney(5123456) => 5,123,456
 */
export const formatMoney = (val: string | number, digits = 0) => {
  const amountStr = String(Number(val).toFixed(digits))
  const reg = /\B(?=(?:\d{3})+$)/g
  // 是否是小数
  const isDecimal = amountStr.includes('.')
  if (isDecimal) {
    // 整数部分
    const integerPart = amountStr.slice(
      0,
      Math.max(0, Math.max(0, amountStr.indexOf('.')))
    )
    // 小数部分
    // eslint-disable-next-line unicorn/prefer-string-slice
    const decimalPart = amountStr.substring(
      amountStr.length,
      amountStr.indexOf('.')
    )
    return `${integerPart.replace(reg, ',')}${decimalPart}`
  } else {
    return amountStr.replace(reg, ',')
  }
}

/**
 * @description 脱敏身份证
 * @param {string} idCard 身份证
 * @returns { String }
 * demo deseCardId('510826199011220017') => 510826********0017
 */
export const deseCardId = (idCard = '') => {
  return REGXS.regxCardId.test(idCard)
    ? idCard.toString().replace(/(\d{6})\d*(\d{4})/g, '$1********$2')
    : idCard
}

/**
 * @description 格式字节
 * @param {number} byte 字节
 */
export const formatByte = (byte = 0) => {
  if (byte === 0) return '0 B'
  const unit = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(byte) / Math.log(unit))
  // eslint-disable-next-line prefer-template, prefer-exponentiation-operator
  return (byte / Math.pow(unit, i)).toPrecision(3) + ' ' + sizes[i]
}
