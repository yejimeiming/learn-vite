# Vite 插件入门(下)

#### `resolveId` 与 `load`

```js
// vite.config.js
export default {
  // import jQuery from 'jquery'
  plugins: [
    {
      enforce: 'pre',
      name: 'vite-plugin-resolve',
      resolveId(source) {},
      load(id) {},
    },
    {
      name: 'vite:resolve',
      resolveId(source) {},
      load(id) {},
    },
  ],
}
```

```js
           transformMiddleware
             transformRequest
                     │
(vite-plugin-resolve)↓                         ┏——————————————————————————┓
┏—————————————————————————————————————————┓    │    ┏—————————————————————————————————————————┓
│ 1.                                      │    │    │ 3.                                      │
│ resolveId(source) {                     │    │    │ load(id = '\0jquery') {                 │
│   return '\0' + 'jquery'                │    ↑    │   return 'export default window.jQuery' │
│ }                                       │    │    │ }                                       │
┗—————————————————————————————————————————┛    │    ┗—————————————————————————————————————————┛
                     │                         │                          │
                     ┗—————— '\0jquery' ———————┛                          ┗——————————————————————> transform
                     │                                                    │
                     x                                                    x
(vite:resolve)       ↓                         ↑                          ↓
┏—————————————————————————————————————————┓    │    ┏—————————————————————————————————————————┓
│ 2.                                      │    x    │ 4.                                      │
│ resolveId(source) { }                   │    │    │ load(id) { }                            │
┗—————————————————————————————————————————┛    │    ┗—————————————————————————————————————————┛
                     ┗—————————————————————————┛                          ┗——————————————————————x
```

#### `transform`

```js
// vite.config.js
export default {
  // import { Button } from 'antd'
  plugins: [
    {
      name: 'vite:esbuild',
      transform(code, id) {},
    },
    {
      name: 'vite-plugin-import-antd',
      transform(code, id) {},
    },
  ],
}
```

```js
(vite:esbuild)
┏————————————————————————————————————————————————┓
│ 1.                                             │
│ transform(code, id) {                          │
│   return tsx -> js                             │
│ }                                              │
┗————————————————————————————————————————————————┛
                          │
(vite-plugin-import-antd) ↓
┏————————————————————————————————————————————————┓
│ 2.                                             │
│ transform(code, id) {                          │
│   return `import Button from 'antd/es/button'` │
│ }                                              │
┗————————————————————————————————————————————————┛
                          │
                          ↓ 
                        send() - 结束
```

## Vite 源码中内置插件运行机制剖析

1. `serve` 特有的 Hook -- 网络钩子(`middleware`)
  - `configureServer` 拦截请求 [vite-html-plugin](https://github.com/caoxiemeihao/vite-plugins/blob/df668041cf04e755b22b016d0470736e453b3f46/packages/vite-html-plugin/src/index.ts#L120-L135)
2. 只需关心的三个 Hook 调用流程
  - [transformMiddleware](https://github.com/vitejs/vite/blob/v4.3.0/packages/vite/src/node/server/middlewares/transform.ts#L44C17-L44C17)
  - [transformRequest](https://github.com/vitejs/vite/blob/v4.3.0/packages/vite/src/node/server/transformRequest.ts#L44C17-L44C17)
  - [resolveId](https://github.com/vitejs/vite/blob/v4.3.0/packages/vite/src/node/server/transformRequest.ts#L144)
  - [load](https://github.com/vitejs/vite/blob/v4.3.0/packages/vite/src/node/server/transformRequest.ts#L180)
  - [transform](https://github.com/vitejs/vite/blob/v4.3.0/packages/vite/src/node/server/transformRequest.ts#L251)
  - [send](https://github.com/vitejs/vite/blob/v4.3.0/packages/vite/src/node/server/middlewares/transform.ts#L201)
3. 内置插件分类(开发, 构建)
  - 内置的 Rollup 插件 `@rollup/plugin-alias`, `@rollup/plugin-commonjs`(只在 build 阶段使用), 
4. 优先级定位(干脆在源码中 hack 优先级)，及无敌的 `@rollup/plugin-alias` 插件 | https://github.com/vitejs/vite/blob/v4.3.0/packages/vite/src/node/plugins/index.ts#L55
