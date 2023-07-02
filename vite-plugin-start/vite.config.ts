import { defineConfig } from 'vite'
import {
  importAntd,
  resolve,
} from './vite.plugin'

export default defineConfig({
  plugins: [
    importAntd(),
    {
      name: 'test',
      transform(code, id) {
        if (id.endsWith('main.tsx')) {
          console.log(code)
        }
      },
    },
    resolve({}),
  ],
})
