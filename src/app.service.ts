import { Injectable, Body } from '@nestjs/common';
// import { Request } from 'express';
import RequestDto from './dto/request.dto';

@Injectable()
export class AppService {
  getBodyByPost(@Body() body: RequestDto): object {
    console.log(body);
    const textSplited = body?.text.split(' ');
    console.log(textSplited);
    const response: object = {
      text: 'Hello World!',
      responseType: 'inChannel',
    };
    return response;
  }
}
