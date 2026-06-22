/* eslint-disable no-unused-vars */
/**
 * 节流函数
 * 在指定的时间内只执行一次函数
 * @param fn 要节流的函数
 * @param wait 等待时间，单位毫秒
 * @param options 配置选项，{ leading: 是否在开始时执行, trailing: 是否在结束后执行 }
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  wait: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let timeout: ReturnType<typeof setTimeout> | null = null
  let previous = 0
  const { leading = true, trailing = true } = options

  const throttled = function (this: unknown, ...args: Parameters<T>) {
    const context = this
    const now = Date.now()

    if (!previous && !leading) {
      previous = now
    }

    const remaining = wait - (now - previous)

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      fn.apply(context, args)
    } else if (!timeout && trailing) {
      timeout = setTimeout(() => {
        previous = leading ? Date.now() : 0
        timeout = null
        fn.apply(context, args)
      }, remaining)
    }
  }

  throttled.cancel = function () {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
    previous = 0
  }

  return throttled
}
