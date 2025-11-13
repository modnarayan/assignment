import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  env: process.env.NODE_ENV || 'local',
  port: parseInt(process.env.ORDER_SERVICE_PORT || '3001', 10),

  // Database
  database: {
    url: process.env.DATABASE_URL || 'localhost',
  },

  productServiceUrl:
    process.env.PRODUCT_SERVICE_URL || 'http://localhost:3000/products',
}));
