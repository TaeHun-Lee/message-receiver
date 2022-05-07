import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RegisterCafeModule } from './register-cafe/register-cafe.module';
import { typeOrmConfig } from './configs/typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), RegisterCafeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
