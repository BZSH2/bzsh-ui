export * from './debounce'
export * from './throttle'

import { debounce } from './debounce'
import { throttle } from './throttle'

export const func = {
  debounce,
  throttle,
} as const
