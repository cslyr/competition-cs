import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
const pathResolve = (dir: string): string => {
  return resolve(__dirname, '.', dir)
}
export default defineConfig(({ mode }) => {
  return {
    plugins: [vue()],
    base: mode === 'production' ? '/es-big-screen' : '',
		resolve: {
			alias: {
				'@': pathResolve('src')
			}
		},
		server: {
      port: 3006,
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:8082',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})
