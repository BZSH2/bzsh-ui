/**
 * 获取值的运行时数据类型。
 * 基于 Object.prototype.toString 统一返回小写类型名称。
 * @param value 要检查的值
 * @returns 小写数据类型名称
 */
export function getDataType(value: unknown): string {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
}
