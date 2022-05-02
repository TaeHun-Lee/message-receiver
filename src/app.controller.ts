import { Controller, Get, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import RequestDto from './dto/request.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/registerCafe')
  getBodyByPost(@Body() body: RequestDto, @Res() response: Response): void {
    response.status(HttpStatus.OK).json(this.appService.getBodyByPost(body));
  }
}