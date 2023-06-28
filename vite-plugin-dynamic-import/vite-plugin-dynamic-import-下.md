# vite-plugin-dynamic-import-下

```
1. es-module-lexer | 找到代码中的 import() 语句
                            ↓
                    截取 importee 部分
                            ↓
2. acorn           | 将 importee 部分转换成 AST
```

## Vite 代码转换 hook

- `transform` // 转换 `import()` 语句
  ```
  1. alias     | `tryResolveAlias`
  2. bare      | `tryResolveBare`
  3. 无文件尾缀  | `globFiles`
  ```

## 转换 import() 核心方法

- `transformDynamicImport()` 转代码范围
  ```
  1. esbuild 插件           | node_modules 中的 npm 包 ---- 需要配合 `options.filter()`
  2. Vite 的 transform 钩子 | 项目源代码(src)
  ```

- `options.loose` 参数对应场景
  ```js
  // 1. Webpack ---- 基于正则
  require('./template/' + name + '.ejs');
  // Directory: ./template
  // Regular expression: /^.*\.ejs$/

  `'./template/' + name + '.ejs'` -> `/^.*\.ejs$/`

  // 运行时
  `require('./template/' + 'directory/another' + '.ejs');` // 子路径
  `require('./template/' + 'table' + '.ejs');`        // 同级路径
  // Webpack 对 dynamic 的定义规则
  // 1. 前面一个边界 -- ./template/
  // 2. 不设边界    -- .*
  // 3. 后面一个边界 -- '.ejs'


  // 2. Rollup ---- 基于 glob
  `'./locales/' + locale + '.js'` -> `'./locales/*.js'` // 只转换成一级路径
  // Rollup 对 dynamic 的定义规则
  // 1. 碰到标识符变成 * -- './locales/'
  // 2. 碰到 / 保持不变 -- /
  ```

- `globFiles()` 根据 AST 计算出 glob ---- 获取匹配文件

- `dynamicImportToGlob()` 根据 importee 解析出 glob

- `toLooseGlob()` 放宽 glob 适配范围 ---- 通过 `**/*` 达到 Webpack 不设边界效果

- `mappingPath()` 计算出映射关系

- `generateDynamicImportRuntime()` 生成 runtime 代码
  * import 放到第一行，mapFunction 放到最后一行 ---- 绕开 sourcemap(anthfu|vite-plugin-vue2)
  * TODO: sourcemap 的支持(https://github.com/vite-plugin/vite-plugin-commonjs/issues/28) ---- 课后思考
