# debounce

`debounce` 用于把一段高频触发的调用压缩为一次执行。

在等待时间内如果再次触发，会重新计时；常用于输入搜索、按钮防连点和频繁状态同步。

## 签名

```ts
function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  wait: number,
  immediate?: boolean
): ((...args: Parameters<T>) => void) & { cancel: () => void }
```

## 示例

```ts
import { debounce } from 'bzsh-ui'

const requestSuggestions = debounce((keyword: string) => {
  console.log('search:', keyword)
}, 300)

requestSuggestions('v')
requestSuggestions('vu')
requestSuggestions('vue')
```

300ms 内连续触发时，只有最后一次参数会真正执行。

## 立即执行模式

```ts
import { debounce } from 'bzsh-ui'

const submit = debounce(
  () => {
    console.log('submit once')
  },
  1000,
  true
)
```

当 `immediate` 为 `true` 时，第一次调用会立即执行，后续在等待时间内的重复触发会被忽略。

## 取消执行

```ts
const saveDraft = debounce(() => {
  console.log('save')
}, 500)

saveDraft()
saveDraft.cancel()
```

## 适用场景

- 输入框联想、远程搜索。
- 防止按钮短时间内被重复点击。
- 需要只保留最后一次状态更新的场景。

## 继续阅读

- [函数控制](./)
- [throttle](./throttle)
