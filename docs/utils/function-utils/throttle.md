# throttle

`throttle` 用于限制函数在一段时间内的最大执行频率。

它适合持续触发但不需要每次都执行的场景，例如滚动、拖拽和窗口尺寸变化。

## 签名

```ts
function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  wait: number,
  options?: { leading?: boolean; trailing?: boolean }
): ((...args: Parameters<T>) => void) & { cancel: () => void }
```

## 示例

```ts
import { throttle } from 'bzsh-ui'

const onScroll = throttle(() => {
  console.log('scroll once')
}, 200)
```

持续滚动时，`onScroll` 会在每个节流周期内最多执行一次。

## 选项说明

```ts
import { throttle } from 'bzsh-ui'

const onResize = throttle(
  () => {
    console.log('resize')
  },
  300,
  {
    leading: true,
    trailing: true,
  }
)
```

- `leading: true` 表示节流开始时允许立即执行。
- `trailing: true` 表示节流结束后再补一次最后触发。

## 取消执行

```ts
const handler = throttle(() => {
  console.log('drag')
}, 100)

handler.cancel()
```

## 适用场景

- 滚动位置监听。
- 鼠标移动、拖拽反馈。
- `resize`、元素观察和高频 UI 刷新控制。

## 继续阅读

- [函数控制](./)
- [debounce](./debounce)
