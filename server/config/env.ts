// Load environment variables from root directory
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

interface Config {
  database: {
    user: string | undefined;
    host: string | undefined;
    database: string | undefined;
    password: string | undefined;
    port: number;
    url: string | undefined;
  };
  server: {
    port: number;
    nodeEnv: string;
  };
  firebase: {
    serviceAccount: string | undefined;
    webApiKey: string | undefined;
  };
}

export const config: Config = {
  database: {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5431,
    url: process.env.DATABASE_URL,
  },
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 8080,
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  firebase: {
    serviceAccount: process.env.FIREBASE_SERVICE_ACCOUNT,
    webApiKey: process.env.FIREBASE_WEB_API_KEY,
  },
};
