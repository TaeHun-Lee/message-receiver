import { Body, Injectable } from '@nestjs/common';
import RequestDto from './dto/request.dto';

@Injectable()
export class RegisterCafeService {
    getBodyByPost(@Body() body: RequestDto): object {
        if (body.isError) {
          return {
            text: body.text,
            responseType: 'ephemeral',
          };
        }
        const textSplited = body?.text.split(' ');
        const response: object = {
          text: 'Hello World!',
          responseType: 'inChannel',
        };
        return response;
      }
}
