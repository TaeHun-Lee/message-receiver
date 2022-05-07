import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CafeMenuService } from './cafe-menu.service';
import { RegisterCafeValidationPipe } from './cafe-menu.validation.pipe';
import RequestDto from './dto/request.dto';

@Controller('cafe-menu')
export class CafeMenuController {
  constructor(private readonly cafeMenuService: CafeMenuService) {}
  @Post()
  async getBodyByPost(
    @Body(new RegisterCafeValidationPipe()) body: RequestDto,
    @Res() response: Response,
  ): Promise<void> {
    response.status(HttpStatus.OK).json(await this.cafeMenuService.getBodyByPost(body));
  }
}
