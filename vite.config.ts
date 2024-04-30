import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dotenv from 'dotenv';


// Carga las variables de entorno desde .env
dotenv.config();
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
