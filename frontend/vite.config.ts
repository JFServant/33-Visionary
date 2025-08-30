import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type ConfigEnv } from 'vite'

// https://vite.dev/config/
export default ({ mode }: ConfigEnv) => {
  const { VITE_CLIENT_PORT } = loadEnv(mode, process.cwd(), 'VITE_')

  return defineConfig({
    plugins: [react()],
    server: { port: Number(VITE_CLIENT_PORT) },
  })
}
