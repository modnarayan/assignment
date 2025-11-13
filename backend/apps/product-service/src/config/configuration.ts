import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  env: process.env.NODE_ENV || 'local',
  port: parseInt(process.env.PRODUCT_SERVICE_PORT || '3000', 10),

  // Database
  database: {
    url: process.env.DATABASE_URL || 'localhost',
  },
}));