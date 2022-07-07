import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CafeMenuRepository } from './cafe-menu.repository';
import { InterActiveRequestDto } from './dto/request.dto';
import { ResponseDto } from './dto/response.dto';

@Injectable()
export class CafeMenuService {
  constructor(@InjectRepository(CafeMenuRepository) private cafeRepository : CafeMenuRepository) {}
  votedMenus: string[] = [];
  voteMenus: string[] = [];
  cafeName: string;
  async addCafe(body: string[]): Promise<object> {
    const title = body[0]
    const menus = body.slice(1);
    const foundCafe = await this.cafeRepository.findOne(title);
    if (foundCafe) {
      const response: object = {
        text: '카페가 이미 존재합니다.\n다른 카페 명을 입력하시거나 --addMenu 액션을 사용해 주세요.',
        responseType: 'ephemeral',
      };
      return response;
    }
    const createdObj = this.cafeRepository.create({
      cafeName: title,
      menu: JSON.stringify(menus),
      lastUpdated: new Date()
    })
    await this.cafeRepository.save(createdObj);
    const response: object = {
      text: '카페가 생성되었습니다.',
      responseType: 'ephemeral',
    };
    return response;
  }

  async addMenu(body: string[]): Promise<object> {
    const title = body[0]
    const menus = body.slice(1);
    const foundCafe = await this.cafeRepository.findOne(title);
    if (!foundCafe) {
      const response: object = {
        text: '카페가 존재하지 않습니다.\n다른 카페 명을 입력해 주세요.',
        responseType: 'ephemeral',
      };
      return response;
    }
    const foundCafeMenu = JSON.parse(foundCafe.menu);
    foundCafeMenu.push(...menus);
    const set = new Set(foundCafeMenu);
    const dupDeletedMenu = [...set];
    foundCafe.menu = JSON.stringify(dupDeletedMenu);
    await this.cafeRepository.save(foundCafe);
    const response: object = {
      text: '카페 메뉴가 추가되었습니다. (자동으로 중복 제거)',
      responseType: 'ephemeral',
    };
    return response;
  }

  async getCafe(): Promise<object> {
    const foundCafes = await this.cafeRepository.query('SELECT * FROM CAFE');
    const cafeParsed = foundCafes?.map(val => val.cafeName.replace(/["']/g, ''));
    let cafes = ''
    for(const cafe of cafeParsed) {
      cafes = cafes.concat(cafe).concat(' ');
    }
    const response: object = {
      text: `${cafes}`,
      responseType: 'ephemeral',
    };
    return response;
  }

  async getMenu(body: string[]): Promise<object> {
    const title = body[0]
    const foundCafe = await this.cafeRepository.findOne(title);
    const { cafeName, menu } = foundCafe;
    const menuParsed = JSON.parse(menu)?.map(val => val.replace(/["']/g, ''));
    const response: object = {
      text: `${cafeName} - ${menuParsed}`,
      responseType: 'ephemeral',
    };
    return response;
  }

  async delete(body: string[]): Promise<object> {
    const title = body[0]
    const foundCafe = await this.cafeRepository.findOne(title);
    if (!foundCafe) {
      const response: object = {
        text: '카페가 존재하지 않습니다.\n다른 카페 명을 입력해 주세요.',
        responseType: 'ephemeral',
      };
      return response;
    }
    this.cafeRepository.delete(title);
    const response: object = {
      text: '카페가 삭제되었습니다.',
      responseType: 'ephemeral',
    };
    return response;
  }

  async deleteMenu(body: string[]): Promise<object> {
    const title = body[0]
    const menus = body.slice(1);
    const foundCafe = await this.cafeRepository.findOne(title);
    if (!foundCafe) {
      const response: object = {
        text: '카페가 존재하지 않습니다.\n다른 카페 명을 입력해 주세요.',
        responseType: 'ephemeral',
      };
      return response;
    }
    const foundCafeMenu = JSON.parse(foundCafe.menu);
    const deletedCafeMenu = foundCafeMenu.filter(cafe => {
      return !menus.includes(cafe)
    });
    const set = new Set(deletedCafeMenu);
    const dupDeletedMenu = [...set];
    foundCafe.menu = JSON.stringify(dupDeletedMenu);
    await this.cafeRepository.save(foundCafe);
    const response: object = {
      text: '카페 메뉴가 삭제되었습니다. (자동으로 중복 제거)',
      responseType: 'ephemeral',
    };
    return response;
  }

  async vote(body: string[]): Promise<object> {
    const title = body[0]
    const foundCafe = await this.cafeRepository.findOne(title);
    if (!foundCafe) {
      const response: object = {
        text: '카페가 존재하지 않습니다.\n다른 카페 명을 입력해 주세요.',
        responseType: 'ephemeral',
      };
      return response;
    }
    const menuList = JSON.parse(foundCafe.menu)
    this.voteMenus = menuList;
    this.cafeName = foundCafe.cafeName;
    const voteMenus = []
    for (const menu of menuList) {
      const buttonObj = {
        name: 'sendVote',
        type: 'button',
        text: menu,
        value: menu
      }
      voteMenus.push(buttonObj);
    }
    const response: ResponseDto = {
      text: `오늘의 카페 : ${foundCafe.cafeName}`,
      callbackId: 'voteParent',
      responseType: 'inChannel',
      attachments: [
        {
          callbackId: 'voteMenu',
          actions: voteMenus
        },
        {
          actions: [
            {
              callbackId: 'confirmVote',
              name: 'confrimVote',
              type: 'button',
              text: '투표 종료',
              value: 'confirmVote'
            },
            {
              callbackId: 'cancelVote',
              name: 'cancelVote',
              type: 'button',
              text: '투표 취소',
              value: 'cancelVote'
            }
          ]
        }
      ],
    }
    return response;
  }

  async voteIm(body: InterActiveRequestDto): Promise<object> {
    console.log('body --- ', body);
    this.votedMenus.push(body.actionValue);
    console.log('voted -- ', this.votedMenus);
    const savedMenus = this.voteMenus
    const voteMenus = [];
    for (const menu of savedMenus) {
      const buttonObj = {
        name: 'sendVote',
        type: 'button',
        text: menu,
        value: menu,
        style: 'default'
      }
      if (menu === body.actionValue) {
        buttonObj.style = 'primary';
      }
      voteMenus.push(buttonObj);
    }
    const response: ResponseDto = {
      text: `오늘의 카페 : ${this.cafeName}`,
      callbackId: 'voteParent',
      responseType: 'ephemeral',
      attachments: [
        {
          callbackId: 'voteMenu',
          actions: voteMenus
        },
        {
          actions: [
            {
              callbackId: 'confirmVote',
              name: 'confrimVote',
              type: 'button',
              text: '투표 종료',
              value: 'confirmVote'
            },
            {
              callbackId: 'cancelVote',
              name: 'cancelVote',
              type: 'button',
              text: '투표 취소',
              value: 'cancelVote'
            }
          ]
        }
      ],
    }
    return response;
  }
}
