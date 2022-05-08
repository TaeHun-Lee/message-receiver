import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { cafeMenuActions } from './cafe-menu.actions';
import { CafeMenuRepository } from './cafe-menu.repository';
import { InterActiveRequestDto, RequestDto } from './dto/request.dto';

@Injectable()
export class CafeMenuService {
  constructor(@InjectRepository(CafeMenuRepository) private cafeRepository : CafeMenuRepository) {}
  getActionsList(@Body() body: RequestDto): object {
    const response: object = cafeMenuActions;
    return response;
  }
  returnAction(@Body() body: InterActiveRequestDto): any {
    console.log('body --- ', body);
    if (body.isError) {
      return {
        text: body.text,
        responseType: 'ephemeral',
      };
    }
    const { actionValue, cmdToken, tenant, channel, triggerId } = body;
    switch(actionValue) {
      case 'register':
      case 'getAll':
      case 'getOne':
      case 'update':
      case 'delete':
      case 'vote':
      default:
        break;
    }
    return {
      text: '띠용'
    };
  }
  async registerCafeMenu(@Body() body: RequestDto): Promise<object> {
    if (body.isError) {
      return {
        text: body.text,
        responseType: 'ephemeral',
      };
    }
    const textSplited = body?.text.split(' ');
    const title = textSplited[0];
    const menu = textSplited.slice(1);
    const createdObj = this.cafeRepository.create({
      cafeName: title,
      menu: JSON.stringify(menu),
      lastUpdated: new Date()
    })
    await this.cafeRepository.save(createdObj);
    const response: object = {
      text: '카페 메뉴가 생성되었습니다.',
      responseType: 'ephemeral',
    };
    return response;
  }
  async getOneCafeMenu(@Body() body: RequestDto): Promise<object> {
    console.log('body --- ', body)
    if (body.isError) {
      return {
        text: body.text,
        responseType: 'ephemeral',
      };
    }
    const title = body?.text;
    const foundCafe = await this.cafeRepository.findOne(title);
    console.log('foundCafe --- ', foundCafe);
    const { cafeName, menu } = foundCafe;
    const menuParsed = JSON.parse(menu);
    const response: object = {
      text: `${cafeName} - ${menuParsed}`,
      responseType: 'ephemeral',
    };
    return response;
  }
}
