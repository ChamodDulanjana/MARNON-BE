import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from './config/database.config';
import { AuthModule } from './module/auth.module';
import { UserModule } from './module/user.module';
import { ProductModule } from './module/product.module';
import { SizeModule } from './module/size.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => await getTypeOrmConfig(),
    }),
    AuthModule,
    UserModule,
    ProductModule,
    SizeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
