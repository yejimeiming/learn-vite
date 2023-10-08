import fs from 'fs'
import path from 'path'
import acorn from 'acorn'

type AstNode = acorn.Node & Record<string, any>

let code = fs.readFileSync(path.join(__dirname, 'ast-source.cjs'), 'utf8')
const ast = acorn.parse(code, { sourceType: 'module', ecmaVersion: 2020 }) // acorn@8.x

// console.log(ast)

walk(ast, {
  // key -> ast node.type
  CallExpression(astNode, ancestors) {
    if (astNode.callee.name === 'require') {
      // console.log(ancestors.map(astNode => astNode.type))
      // console.log(astNode)

      const index = ancestors.findIndex(node => node === astNode)
      const declarator = ancestors[index - 1]
      const declaration = ancestors[index - 2]

      // console.log(declarator.type)
      // console.log(declaration.type)

      const importName = declarator.id.name
      const importee = astNode.arguments[0].value
      // console.log(importee)

      const importStatement = `import * as ${importName} from "${importee}";`

      code = code.slice(0, declaration.start) + importStatement + code.slice(declaration.end)
    }
  },
})

// 输出转换后的代码
fs.writeFileSync(path.join(__dirname, 'ast-source.mjs'), code)

function walk(
  astNode: AstNode, // acorn.parse() -> ast
  visitor: { [type: string]: (astNode: AstNode, ancestors: AstNode[]) => void },
  ancestors: AstNode[] = [],
) {
  if (!astNode) return

  if (Array.isArray(astNode)) {
    for (const node of astNode) {
      walk(node, visitor, ancestors)
    }
  } else if (typeof astNode === 'object') {
    ancestors = ancestors.concat(astNode)
    visitor[astNode.type]?.(astNode, ancestors)
    for (const [, node] of Object.entries(astNode)) {
      walk(node, visitor, ancestors)
    }
  }
}
