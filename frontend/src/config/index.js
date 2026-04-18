const ENV = import.meta.env

const config = {
  appName: ENV.VITE_APP_NAME || 'App',
  appTitle: ENV.VITE_APP_TITLE || 'Demo App',
  baseURL: ENV.VITE_BASE_URL || '/api',
  apiBase: ENV.VITE_API_BASE || 'http://localhost:3002'
}

export function getConfig(key) {
  if (!key) return { ...config }
  return config[key]
}