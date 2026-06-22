# 函数控制

`function-utils` 目录用于承载函数调用频率控制相关工具，对应源码目录 `packages/utils/function-utils/`。

当前这一层主要解决高频事件下的调用时机问题，例如输入联想、滚动监听和窗口尺寸变化。

## 当前内容

- [debounce](./debounce)
- [throttle](./throttle)

## 使用方式

```ts
import { debounce, func, throttle } from 'bzsh-ui'

const onInput = debounce((keyword: string) => {
  console.log(keyword)
}, 300)

const onScroll = throttle(() => {
  console.log('scroll')
}, 200)

func.debounce(() => {}, 300)
func.throttle(() => {}, 200)
```

## 推荐方式

- 需要在一段时间内只执行最后一次调用时，使用 `debounce()`。
- 需要固定时间间隔内最多执行一次时，使用 `throttle()`。
- 需要统一从聚合对象读取时，可以使用 `func.debounce` 和 `func.throttle`。

## 适用场景

- 输入框搜索建议、防重复触发提交。
- 滚动事件、拖拽事件、窗口 resize 监听。
- 需要显式取消延迟执行时，调用返回函数上的 `cancel()`。

## 继续阅读

- [debounce](./debounce)
- [throttle](./throttle)
- [Utils 工具函数](../)
