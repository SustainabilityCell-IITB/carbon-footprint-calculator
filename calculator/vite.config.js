import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env vars (including non VITE_ prefixed ones like VITE_BASE) for this mode.
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // Sub-path the app is served from. On gymkhana this must be "/~<username>/".
    // Configured via VITE_BASE so the same code can build for any host.
    base: env.VITE_BASE || '/carbon-footprint-calculator/',
    plugins: [react()],
  }
})
