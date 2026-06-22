# isNumber

`isNumber` 鐢ㄤ簬鍒ゆ柇涓€涓€肩殑杩愯鏃剁被鍨嬫槸鍚︿负 `number`銆?

## 绛惧悕

```ts
function isNumber(value: unknown): value is number
```

## 绀轰緥

```ts
import { isNumber } from 'bzsh-ui'

isNumber(1) // true
isNumber(Number.NaN) // true
isNumber('1') // false
```

涔熷彲浠ヤ娇鐢ㄨ仛鍚堝舰寮忥細

```ts
import { is } from 'bzsh-ui'

is.number(1) // true
is.number('1') // false
```

## 琛屼负璇存槑

- 浠呭綋鍊肩殑绫诲瀷涓?`number` 鏃惰繑鍥?`true`銆?- 璇ユ柟娉曞熀浜?`getDataType()` 鍒ゆ柇杩愯鏃剁被鍨嬶紝鍥犳 `NaN` 渚濈劧浼氳璇嗗埆涓?`number`銆?- 褰撳墠婧愮爜浣嶄簬 `packages/utils/type-guards/is-number.ts`銆?

## 閫傜敤鍦烘櫙

- 缁勪欢 props 鐨勮繍琛屾椂绫诲瀷瀹堝崼銆?- 宸ュ叿鍑芥暟鍐呴儴鐨勮緭鍏ユ牎楠屻€?

## 缁х画闃呰

- [类型判断](./)
- [getDataType](../type-utils/get-data-type)
