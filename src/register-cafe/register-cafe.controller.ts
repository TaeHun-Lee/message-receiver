import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import RequestDto from './dto/request.dto';
import { ValidationPipe } from './pipes/request.validation.pipe';
import { RegisterCafeService } from './register-cafe.service';

@Controller('register-cafe')
export class RegisterCafeController {
    constructor(private readonly appService: RegisterCafeService) {}
    @Post()
    getBodyByPost(
      @Body(new ValidationPipe()) body: RequestDto,
      @Res() response: Response,
    ): void {
      response.status(HttpStatus.OK).json(this.appService.getBodyByPost(body));
    }
}
