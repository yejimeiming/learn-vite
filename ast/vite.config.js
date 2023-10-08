import vite from 'vite'

vite.build({
  plugins: [
    {
      resolveId() {
        this.parse()
      },
      load() {
        this.parse()
      },
      transform() {
        this.parse()
      },
    },
  ],
})
