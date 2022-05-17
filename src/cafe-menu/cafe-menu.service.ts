import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CafeMenuRepository } from './cafe-menu.repository';

@Injectable()
export class CafeMenuService {
  constructor(@InjectRepository(CafeMenuRepository) private cafeRepository : CafeMenuRepository) {}
  async registerCafeMenu(body: string[]): Promise<object> {
    const title = body[0]
    const menus = body.slice(1);
    const createdObj = this.cafeRepository.create({
      cafeName: title,
      menu: JSON.stringify(menus),
      lastUpdated: new Date()
    })
    await this.cafeRepository.save(createdObj);
    const response: object = {
      text: '카페 메뉴가 생성되었습니다.',
      responseType: 'ephemeral',
    };
    return response;
  }
  async getOneCafeMenu(body: string[]): Promise<object> {
    const title = body[0]
    const foundCafe = await this.cafeRepository.findOne(title);
    const { cafeName, menu } = foundCafe;
    const menuParsed = JSON.parse(menu);
    const response: object = {
      text: `${cafeName} - ${menuParsed}`,
      responseType: 'ephemeral',
    };
    return response;
  }
}
