import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductServiceModule } from './product-service.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [configuration],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: configuration().database.url,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Dev only; use migrations in prod
      logging: false,
    }),
    ProductServiceModule,
  ],
})
export class AppModule {}
