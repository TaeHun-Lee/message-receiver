import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RegisterCafeModule } from './register-cafe/register-cafe.module';
import { typeOrmConfig } from './configs/typeorm.config';
import { CafeMenuModule } from './cafe-menu/cafe-menu.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), RegisterCafeModule, CafeMenuModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
