import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { OrderServiceModule } from './order-service.module';
import configuration from './config/configuration';
import { ConfigModule } from '@nestjs/config';

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
      synchronize: true, // Dev only
      logging: false,
    }),
    HttpModule,
    OrderServiceModule,
  ],
})
export class AppModule {}
