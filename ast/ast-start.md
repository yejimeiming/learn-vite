## AST 入门

- 工具网站 👉 https://astexplorer.net/ 

## 主流工具

- [acorn](https://github.com/acornjs/acorn)
  1. 目前最快的 Pure JavaScript AST 解析库
  2. Rollup、Webpack 语法分析依赖

- [@babel/parser](https://github.com/babel/babel/tree/main/packages/babel-parser) | 基于 acorn 扩展 ❗️
  1. 提供了全家桶工具
    * [traverse](https://babeljs.io/docs/babel-traverse) 遍历 ❗️
    * [types](https://babeljs.io/docs/babel-types) 定义、类型判断 ❗️
    * [generator](https://babeljs.io/docs/babel-generator) 生成代码
    * [template](https://babeljs.io/docs/babel-template) 相当于 es6 的模板字符串功能
  2. 扩展了 注释节点、js 类型节点

## Vite 中的 AST

- Rollup 内置了 `acorn` 👉 [this.parse](https://rollupjs.org/plugin-development/#this-parse)
- 专注于 `import`、`export` 解析 👉 [es-module-lexer](https://github.com/guybedford/es-module-lexer)

## 最佳实践 (可能是)

- `babel` 全家桶
  1. 目前最简单的 AST 操作方式
  2. 性能不如 `acorn`
- Vite 中的代码操作
  1. `acorn` + [estree-walker](https://github.com/Rich-Harris/estree-walker) + [magic-string](https://github.com/rich-harris/magic-string)
  2. `es-module-lexer` + `magic-string`
