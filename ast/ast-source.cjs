// 引入 acorn
const acorn = require('acorn');
// commonjs 入门 module interop - 模块互操作
// import * as acorn from 'acorn';

// 1. require(id)  - importee(vite-plugin-dynamic-import)
// 2. 引入模块标识符 - import name
// 3. const acorn = require('acorn'); -> import * as acorn from 'acorn';

// Webpack
// Rollup + commonjs ✅
// Vite + dev ❌

console.log('The members of acorn are:', Object.keys(acorn));


// vite-plugin-commonjs (step 1)
