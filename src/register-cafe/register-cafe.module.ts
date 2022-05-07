import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterCafeController } from './register-cafe.controller';
import { RegisterCafeService } from './register-cafe.service';
import { RegisterCafeRepositry } from './register-cafe.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RegisterCafeRepositry])],
  controllers: [RegisterCafeController],
  providers: [RegisterCafeService]
})
export class RegisterCafeModule {}
