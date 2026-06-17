export function isString(...args: unknown[]): never {
  void args
  throw new Error('Method "isString" is not implemented.')
}
