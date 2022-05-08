import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CafeMenuService } from './cafe-menu.service';
import { RegisterCafeValidationPipe, CafeValidationPipe, InterActiveValidationPipe } from './cafe-menu.validation.pipe';
import { RequestDto, InterActiveRequestDto } from './dto/request.dto';

@Controller()
export class CafeMenuController {
  constructor(private readonly cafeMenuService: CafeMenuService) {}
  @Post('actions')
  getActionsList(@Body() body: RequestDto,
  @Res() response: Response,
  ): void {
    response.status(HttpStatus.OK).json(this.cafeMenuService.getActionsList(body));
  }
  @Post('returnAction')
  returnAction(@Body(new InterActiveValidationPipe()) body: InterActiveRequestDto,
  @Res() response: Response,
  ): void {
    response.status(HttpStatus.OK).json(this.cafeMenuService.returnAction(body));
  }
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
