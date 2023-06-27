# vite-plugin-dynamic-import

## 核心解析器

## 技术栈

- 语法解析器
  1. es-module-lexer // 性能极高，C 编写编译成 wasm
    从 js 文件中找出 import() 语句
    `import('path')`            bare
    `import(`@/${path}`)`       alias
    `import('./page' + path)`   无文件尾缀(无文件尾缀)
  2. acorn(babel、babel-jsx) // 性能高，js 编写
    解析 `import()` 中的表达式
    1. bare     - Literal
    2. alias    - TemplateLiteral
    3. 字符串拼接 - BinaryExpression

- glob(*) 通配符
  1. `'./locales/*.js'`
    - `'./locales/zh-CN.js'`
    - `'./locales/en-US.js'`
  2. `'./*/*.js'`
    - `'./foo/a.js'`
    - `'./bar/b.js'`

  - `*` 一级目录
  - `**` 多级目录

## Vite 中的一些问题

- 不支持别名(3.x) - 部分支持
- 不支持裸模块
- 不支持无文件尾缀情况
- 任意级目录支持不友好 - Webpack 支持的相当好

```ts
// importee              `@/pages/${path}`
// importee.slice(1, -1)  @/pages/${path}
// resolve                /User/aotm/vite-project/src/pages/foo.tsx
// ❌ bare - `antd/dist/${component}`
// ❌ @/${path}
```

## 业务场景

```tsx
// React

// App.tsx
// router.tsx
// pages
//   foo.tsx
//   bar.tsx

// router.tsx

export const configs = [
  {
    name: 'Foo',
    path: 'foo', // 文件路径
  },
  {
    name: 'Bar',
    path: 'bar', // 文件路径
  },
]

export const routes = configs.map(config => ({
  ...config,
  component: import(`./pages/${config.path}`), // 无文件尾缀
  component: import(`@/pages/${config.path}`), // alias
}))

// 解析结果
import('./pages/foo')
import('./pages/bar')

// App.tsx
// bare(非相对路径、绝对路径、别名开头)
import('ui-lib/styles/' + theme + '.css')

// 需要处理的情况
// 1. bare
// 2. alias
// 3. 无文件尾缀
```

## 源码部分
