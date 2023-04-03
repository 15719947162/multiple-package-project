/**
 * @description 下载链接方式下载
 * @param { String } link 下载链接
 * @param { String } name 下载名
 * demo downloadLink('http://hvtest.wisewe.cn:8049/ps/attachment/download?attachmentId=402024805160714240','SQL反模式总结.png')
 */
export const downloadLink = (link: string, name: string) => {
    if (!name) {
      new Error(`未配置文件名称！`)
    }
    const eleLink = document.createElement('a')
    eleLink.download = name
    eleLink.style.display = 'none'
    eleLink.href = link
    document.body.appendChild(eleLink)
    eleLink.click()
    document.body.removeChild(eleLink)
  }
  