# isArrayBuffer

`isArrayBuffer` 用于判断一个值是否为 `ArrayBuffer` 实例。

## 签名

```ts
function isArrayBuffer(value: unknown): value is ArrayBuffer
```

## 示例

```ts
import { isArrayBuffer } from 'bzsh-ui'

isArrayBuffer(new ArrayBuffer(8)) // true
isArrayBuffer([]) // false
```

也可以使用聚合形式：

```ts
import { is } from 'bzsh-ui'

is.arrayBuffer(new ArrayBuffer(8)) // true
is.arrayBuffer([]) // false
```

## 行为说明

- 仅当值的运行时类型为 `arraybuffer` 时返回 `true`。
- 当前源码位于 `packages/utils/type-guards/is-arraybuffer.ts`。

## 适用场景

- 处理二进制数据前做类型校验。
- 区分原始缓冲区与普通数组。

## 继续阅读

- [类型判断](./)
- [getDataType](../type-utils/get-data-type)
