import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CafeMenuService } from './cafe-menu.service';
import { RegisterCafeValidationPipe, CafeValidationPipe } from './cafe-menu.validation.pipe';
import RequestDto from './dto/request.dto';

@Controller()
export class CafeMenuController {
  constructor(private readonly cafeMenuService: CafeMenuService) {}
  @Post('register')
  async registerCafeMenu(
    @Body(new RegisterCafeValidationPipe()) body: RequestDto,
    @Res() response: Response,
  ): Promise<void> {
    response.status(HttpStatus.OK).json(await this.cafeMenuService.registerCafeMenu(body));
  }
  @Post('getOne')
  async getOneCafeMenu(
    @Body(new CafeValidationPipe()) body: RequestDto,
    @Res() response: Response,
  ): Promise<void> {
    response.status(HttpStatus.OK).json(await this.cafeMenuService.getOneCafeMenu(body));
  }
}
