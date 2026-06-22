/* eslint-disable no-unused-vars */
/**
 * 防抖函数
 * 在事件被触发后等待 n 毫秒后才执行，如果在这 n 毫秒内再次触发，则重新计时
 * @param fn 要防抖的函数
 * @param wait 等待时间，单位毫秒
 * @param immediate 是否立即执行（第一次触发时）
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  wait: number,
  immediate = false
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let timeout: ReturnType<typeof setTimeout> | null = null
  let result: unknown

  const debounced = function (this: unknown, ...args: Parameters<T>) {
    const context = this

    if (timeout) {
      clearTimeout(timeout)
    }

    if (immediate) {
      const callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if (callNow) {
        result = fn.apply(context, args)
      }
    } else {
      timeout = setTimeout(() => {
        result = fn.apply(context, args)
      }, wait)
    }

    return result
  }

  debounced.cancel = function () {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }

  return debounced
}
