const omit = <T extends object, K extends keyof T>(
  obj: T,
  fields: K[]
): Omit<T, K> => {
  // eslint-disable-next-line prefer-object-spread
  const shallowCopy = Object.assign({}, obj)
  for (const key of fields) {
    delete shallowCopy[key]
  }
  return shallowCopy
}
export default omit
