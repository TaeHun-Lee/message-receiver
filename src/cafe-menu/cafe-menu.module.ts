import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CafeMenuController } from './cafe-menu.controller';
import { CafeMenuRepository } from './cafe-menu.repository';
import { CafeMenuService } from './cafe-menu.service';

@Module({
  imports: [TypeOrmModule.forFeature([CafeMenuRepository])],
  controllers: [CafeMenuController],
  providers: [CafeMenuService]
})
export class CafeMenuModule {}
