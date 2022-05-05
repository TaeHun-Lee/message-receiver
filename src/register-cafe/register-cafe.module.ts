import { Module } from '@nestjs/common';
import { RegisterCafeController } from './register-cafe.controller';
import { RegisterCafeService } from './register-cafe.service';

@Module({
  controllers: [RegisterCafeController],
  providers: [RegisterCafeService]
})
export class RegisterCafeModule {}
