# Vite 从入门到放弃

## Vite 目录结构

```tree
├─┬ packages         mono-repo 多仓库
│ ├── create-vite    npm create vite
│ ├── plugin-legacy  npm 
│ └─┬ vite           Vite 主文件夹
│   ├── client       启动 Vite 之后注入到 index.html(HMR, socket)
│   ├── node         核心源码
│   └── types        类型补充 Rollup、Rollup Plugins
```

## npm run dev

> 可能是一个面试、@vue/cli、create-react-app

`packages/vite/src/node/cli.ts`

- `cac` 解析命令、参数
- 创建 ViteDevServer 
  * config -> resolveConfig() 重要 ✅
    - 引入内置插件的加载 重中之重 ✅
  * connect+http(调用pluginContainer) - expresss, koa 具有相同的中间件机制 use() | 很多人会误以为 Vite 使用的是 koa(1.x)
  * `pluginContainer` 与 Rollup 插件机制相同，意义在于服务于 ViteDevServer ✅
    - `resolveId` // 文件路径解析
    - `load`      // 文件加载
    - `tarnsofrm` // 文件编译

## 核心流程
// 整个 Vite 加载文件的核心逻辑(预构建)
```js
const createResolver: ResolvedConfig['createResolver'] = (options) => {
```

// Not Bundle
// 1. 浏览器解析 import 发起 http 请求到 ViteDevServer
// 2. connect - middlewares 中间件拦截
// 3. 调用 pluginContainer 执行，文件路径解析，文件加载，文件编译
// 4. 将转换后的文件返回给浏览器
