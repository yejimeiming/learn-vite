# vite-plugin-electron 入门

## 配置讲解

1. `entry` Vite lib 构建方式快捷入口 👉 https://vitejs.dev/guide/build.html#library-mode

2. `vite` 与 `vite.config.ts` 相同 👉 https://vitejs.dev/guide/api-javascript.html#inlineconfig

3. `onstart` 自定义启动

- 主进程代码更新，重启 ELectron
- preload.ts 代码更新
  1. 重启 ELectron(慢)
  2. 刷新渲染进程(浏览器刷新按钮) ✅

## 使用第三方包

1. `esmodule` 包

`type`: "module" | "commonjs"

- `got`
- `node-fetch`

2. `commonjs` 包

- `electron-store`
- `express`

3. `C/C++` native 包

- `sqlite3`
- `serialport`
