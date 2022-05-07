import { Module } from '@nestjs/common';
import { CafeMenuController } from './cafe-menu.controller';
import { CafeMenuService } from './cafe-menu.service';

@Module({
  controllers: [CafeMenuController],
  providers: [CafeMenuService]
})
export class CafeMenuModule {}
