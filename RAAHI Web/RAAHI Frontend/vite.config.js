import fs from 'node:fs';
import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const loadClientKeyConfig = (mode) => {
  const env = loadEnv(mode, process.cwd(), '');
  const configuredPath = env.VITE_API_KEYS_FILE_PATH;
  let parsedKeys = {};

  if (configuredPath) {
    const resolvedPath = path.resolve(process.cwd(), configuredPath);

    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`Client API keys file not found at: ${resolvedPath}`);
    }

    parsedKeys = JSON.parse(fs.readFileSync(resolvedPath, 'utf8').replace(/^\uFEFF/, ''));
  }

  return {
    'import.meta.env.VITE_FIREBASE_API_KEY': JSON.stringify(
      parsedKeys.firebase?.apiKey ?? env.VITE_FIREBASE_API_KEY ?? ''
    ),
    'import.meta.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify(
      parsedKeys.firebase?.authDomain ?? env.VITE_FIREBASE_AUTH_DOMAIN ?? ''
    ),
    'import.meta.env.VITE_FIREBASE_DATABASE_URL': JSON.stringify(
      parsedKeys.firebase?.databaseURL ?? env.VITE_FIREBASE_DATABASE_URL ?? ''
    ),
    'import.meta.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify(
      parsedKeys.firebase?.projectId ?? env.VITE_FIREBASE_PROJECT_ID ?? ''
    ),
    'import.meta.env.VITE_FIREBASE_STORAGE_BUCKET': JSON.stringify(
      parsedKeys.firebase?.storageBucket ?? env.VITE_FIREBASE_STORAGE_BUCKET ?? ''
    ),
    'import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(
      parsedKeys.firebase?.messagingSenderId ?? env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? ''
    ),
    'import.meta.env.VITE_FIREBASE_APP_ID': JSON.stringify(
      parsedKeys.firebase?.appId ?? env.VITE_FIREBASE_APP_ID ?? ''
    ),
    'import.meta.env.VITE_GOOGLE_MAPS_API_KEY': JSON.stringify(
      parsedKeys.googleMapsApiKey ?? env.VITE_GOOGLE_MAPS_API_KEY ?? ''
    ),
    'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(
      parsedKeys.geminiApiKey ?? env.VITE_GEMINI_API_KEY ?? ''
    ),
    'import.meta.env.VITE_OPENWEATHER_API_KEY': JSON.stringify(
      parsedKeys.openWeatherApiKey ?? env.VITE_OPENWEATHER_API_KEY ?? ''
    ),
  };
};

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    }
  },
  define: {
    'process.env': {},
    ...loadClientKeyConfig(mode),
  },
}));
