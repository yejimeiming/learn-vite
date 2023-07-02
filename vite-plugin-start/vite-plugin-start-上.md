# Vite 插件入门(上)

## Hook 类型

- 全局钩子 | https://vitejs.dev/guide/api-plugin.html#vite-specific-hooks
  1. `config` 修改默认配置
  2. `configResolved` 获取加载后配置，方法

- 局部钩子(文件钩子, module) | https://vitejs.dev/guide/api-plugin.html#universal-hooks
  1. `resolveId` 解析文件、虚拟模块路径
  2. `load` 加载磁盘、网络文件、虚拟文件
  3. `transform` 转换文件内容(code)

## 使用 `resolveId`, `load` Hook -- 实战

#### `vite-plugin-resolve` 源码实现

1. 你不知道的 `resolveId` 优先级问题
  - 内置插件(`vite:resolve`) | https://github.com/vitejs/vite/blob/v4.3.0/packages/vite/src/node/plugins/index.ts#L61
    ↓
    用户插件(`normal`) | https://github.com/vitejs/vite/blob/v4.3.0/packages/vite/src/node/plugins/index.ts#L88
2. 你不知道的 `\0` 前缀约定
  - Rollup | https://rollupjs.org/plugin-development/#conventions
  - Vite | https://github.com/vitejs/vite/blob/v4.3.0/packages/vite/src/node/plugins/resolve.ts#L150

## 使用 `transform` Hook -- 实战

#### 实现一个 antd 按需引入插件

```diff
- import { Button } from 'antd'
+ import Button from 'antd/es/button'
```

1. 内置 `this.parse` 使用
2. `ast` 解析及 tree-walk
3. 你不知道的内置 `jsx` 转换
