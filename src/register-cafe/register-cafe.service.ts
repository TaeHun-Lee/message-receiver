import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import RequestDto from './dto/request.dto';
import { RegisterCafeRepositry } from './register-cafe.repository';

@Injectable()
export class RegisterCafeService {
  constructor(@InjectRepository(RegisterCafeRepositry) private registerCafeRepository : RegisterCafeRepositry) {}
  async getBodyByPost(@Body() body: RequestDto): Promise<object> {
      if (body.isError) {
        return {
          text: body.text,
          responseType: 'ephemeral',
        };
      }
      const textSplited = body?.text.split(' ');
      const title = textSplited[0];
      const menu = textSplited.slice(1);
      const createdObj = this.registerCafeRepository.create({
        cafeName: title,
        menu: JSON.stringify(menu),
        lastUpdated: new Date()
      })
      await this.registerCafeRepository.save(createdObj);
      const response: object = {
        text: '카페 메뉴가 생성되었습니다.',
        responseType: 'ephemeral',
      };
      return response;
    }
}