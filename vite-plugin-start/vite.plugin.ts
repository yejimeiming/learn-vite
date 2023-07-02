import {
  type Plugin,
  transformWithEsbuild,
} from 'vite'

export function resolve(entries: { [name: string]: string }): Plugin {
  const prefix = '\0plugin-resolve:'

  return {
    name: 'vite-plugin-resolve',
    // 提前到 Vite 内置的 vite:resolve 插件钱
    enforce: 'pre',
    resolveId(source) {
      // 判断是否为用户自定义 resolve 模块
      if (Object.keys(entries).includes(source)) {
        // 拼接 \0 前缀避开其他插件处理
        return prefix + source
      }
    },
    load(id) {
      if (id.startsWith(prefix)) {
        id = prefix.replace(prefix, '')
        // 根据模块 id 返回用户 resolve 的内容
        return entries[id]
      }
    },
  }
}

export function importAntd(): Plugin {
  return {
    name: 'vite-plugin-importAntd',
    transform(code) {
      // @ts-ignore
      const ast = this.parse(code)
      let antdImportNode: Record<string, any> | undefined
      const antdImports: string[] = []

      treeWalk(ast, {
        ImportDeclaration(node) {
          if (node.source.value === 'antd') {
            antdImportNode = node
            for (const spec of node.specifiers) {
              antdImports.push(`import ${spec.local.name} from "antd/es/${spec.local.name.toLowerCase()}"`)
            }
          }
        },
      })

      if (antdImportNode) {
        return code.slice(0, antdImportNode.start)
          + antdImports.join(';') + ';'
          + code.slice(antdImportNode.end)
      }
    },
  }
}

function treeWalk(
  ast: Record<string, any> | Array<Record<string, any>>,
  visitor: { [type: string]: (ast: Record<string, any>) => void },
) {
  for (const node of Object.values(ast)) {
    if (node && typeof node === 'object') {
      visitor[node.type]?.(node)
      treeWalk(node, visitor)
    }
  }
}
