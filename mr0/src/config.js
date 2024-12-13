import dotenv from 'dotenv';
dotenv.config();

const validateEnv = () => {
  const required = ['TOKEN_SECRET'];
  for (const item of required) {
    if (!process.env[item]) {
      throw new Error(`${item} debe estar definido en las variables de entorno`);
    }
  }
};

try {
  validateEnv();
} catch (error) {
  console.error('Error en la configuración:', error.message);
  process.exit(1);
}

export const PORT = process.env.PORT || 4000;
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mrdatabase';
export const TOKEN_SECRET = process.env.TOKEN_SECRET;
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";