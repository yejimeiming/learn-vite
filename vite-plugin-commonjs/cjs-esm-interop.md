## CommonJs

1. 任意地方使用 (esm)✅
2. 匿名导出 `module.export = {}` (esm)❌
3. 同步导入、导出 (esm)❌
4. 支持动态 id:require(`./${path}`):同步 | (esm:import)❌, (esm:import(`./${path}`):异步)✅
  - vite-plugin-dynamic-import

```js
// 1
const fs = require('fs')

// 2 - 任意位置导入
let fs
if (process.env.IS_NODE) {
  fs = require('fs')
}

// 3 - 匿名导出
module.exports = function () {}
```

## ESModule

1. 静态导入必须在顶级作用域 (cjs)✅
2. 动态导入(任意位置)，会返回 Promise 对象 (cjs)✅
3. 只能具名导入 (cjs)✅

```ts
// 1
import fs from 'fs'

// 2 - esModuleInterop 同步、异步问题
let fs: Promise<Fs>
if (process.env.IS_NODE) {
  fs = import('fs').then(m => m.default)
}

// 3 匿名导入 - cjs 必须提供一个 defalut 字段
import {
  defalut as fs
} from 'fs'

exports.__esModule = true

Object.defineProperties(exports, {
  __esModule: { value: true }
});
```

## vite-plugin-commonjs

```js
// hoist 提举 - 作用域提升 - 声明提升
// fs 中一旦有立即执行逻辑会被马上执行 - 提升风险 ⚠️
import * as _M_01 from 'fs'
import * as _M_02 from 'path'

export const readFile = _M_01.readFile
// ...
const keywords_default = _M_01.default || _M_01

export {
  keywords_default as default,
}
```
