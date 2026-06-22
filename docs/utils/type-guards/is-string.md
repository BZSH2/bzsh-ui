# isString

`isString` 鐢ㄤ簬鍒ゆ柇涓€涓€兼槸鍚︿负瀛楃涓茬被鍨嬨€?

## 绛惧悕

```ts
function isString(value: unknown): value is string
```

## 绀轰緥

```ts
import { isString } from 'bzsh-ui'

isString('demo') // true
isString('') // true
isString(1) // false
```

涔熷彲浠ヤ娇鐢ㄨ仛鍚堝舰寮忥細

```ts
import { is } from 'bzsh-ui'

is.string('demo') // true
is.string(1) // false
```

## 琛屼负璇存槑

- 浠呭綋鍊肩殑绫诲瀷涓?`string` 鏃惰繑鍥?`true`銆?- 绌哄瓧绗︿覆渚濈劧灞炰簬瀛楃涓诧紝鍥犳浼氳繑鍥?`true`銆?- 褰撳墠婧愮爜浣嶄簬 `packages/utils/type-guards/is-string.ts`銆?

## 閫傜敤鍦烘櫙

- 缁勪欢 props 鐨勮繍琛屾椂绫诲瀷瀹堝崼銆?- 宸ュ叿鍑芥暟鍐呴儴鐨勮緭鍏ユ牎楠屻€?

## 缁х画闃呰

- [类型判断](./)
- [getDataType](../type-utils/get-data-type)
