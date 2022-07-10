import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CafeMenuRepository } from './cafe-menu.repository';
import { InterActiveRequestDto } from './dto/request.dto';
import { ResponseDto } from './dto/response.dto';

@Injectable()
export class CafeMenuService {
  voteObj: {
    cafeName: string,
    voteMenus: Array<any>,
    votedMenus: Array<any>,
    votedUsers: Array<any>
  };
  constructor(@InjectRepository(CafeMenuRepository) private cafeRepository : CafeMenuRepository, private readonly httpService: HttpService) {
    this.voteObj = {
      cafeName: '',
      voteMenus: [],
      votedMenus: [],
      votedUsers: []
    };
  }
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
    const menuList = JSON.parse(foundCafe.menu);
    this.voteObj.voteMenus = menuList;
    this.voteObj.cafeName = foundCafe.cafeName;
    const voteMenus = []
    for (const menu of menuList) {
      const buttonObj = {
        title: menu
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
          fields: voteMenus
        },
        {
          actions: [
            {
              callbackId: 'confirmVote',
              name: 'confrimVote',
              type: 'button',
              text: '투표 시작',
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

    if (body.actionValue === 'confirmVote') {
      const menuList = this.voteObj.voteMenus;
      const voteMenus = [];
      for (const menu of menuList) {
        const buttonObj = {
          name: 'sendVote',
          type: 'button',
          text: menu,
          value: menu,
          style: 'default'
        }
        voteMenus.push(buttonObj);
      }
      const response: ResponseDto = {
        text: `오늘의 카페 : ${this.voteObj.cafeName}`,
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
    } else if (body.actionValue === 'cancelVote') {
      this.voteObj = {
        cafeName: '',
        voteMenus: [],
        votedMenus: [],
        votedUsers: []
      };
      const response: object = {
        text: '투표가 취소되었습니다.',
        replaceOriginal: false,
        responseType: 'ephemeral',
      };
      return response;
    } else if (body.actionValue === 'endVote') {
      const feildList = [];
      for (const menu of this.voteObj.votedMenus) {
        const foundUsers = this.voteObj.votedUsers.filter(user => {
          return user.votedMenus.find(votedMenu => votedMenu === menu);
        });
        let userStr = ''
        for (const user of foundUsers) {
          userStr = `${user.name} `
        }
        const fieldObj = {
          title: menu,
          value: userStr
        }
        feildList.push(fieldObj);
      }
      const response: ResponseDto = {
        text: `오늘의 카페 : ${this.voteObj.cafeName}`,
        callbackId: 'voteParent',
        responseType: 'ephemeral',
        attachments: [
          {
            fields: [
              {
                title: '투표 종료',
                value: `총 투표 인원 수 : ${this.voteObj.votedUsers.length}`
              }
            ]
          },
          {
            fields: feildList,
          }
        ],
      };
      this.voteObj = {
        cafeName: '',
        voteMenus: [],
        votedMenus: [],
        votedUsers: []
      };
      return response;
    } else {
      const userEmail = body.user.email;
      const headersRequest = {
        'Content-Type': 'application/json',
        'Authorization': `dooray-api j2id6kaltddi:CKP8nMaxQcCWpbbcDVbNpA`,
      };
      const userSearch = await this.httpService.get(`https://api.dooray.com/common/v1/members?externalEmailAddresses=${userEmail}`, {
        headers: headersRequest
      }).toPromise();
      const crntUser = userSearch.data.result.find(user => user.externalEmailAddress === userEmail)?.name;

      let userVoted = this.voteObj.votedUsers.find(user => user.name === crntUser);
      if (userVoted) {
        const index = this.voteObj.votedUsers.findIndex(user => user.name === crntUser);
        const voted = userVoted.votedMenus;
        const indexIsAlreadyVoted = voted.findIndex(voteMenu => voteMenu === body.actionValue);
        if (indexIsAlreadyVoted > -1) {
          this.voteObj.votedUsers[index].votedMenus = this.voteObj.votedUsers[index].votedMenus.filter(el => el !== body.actionValue);
        } else {
          voted.push(body.actionValue);
          this.voteObj.votedUsers[index].votedMenus = voted;
        }
      } else {
        this.voteObj.votedUsers.push({
          name: crntUser,
          votedMenus: [body.actionValue]
        })
      }
      userVoted = this.voteObj.votedUsers.find(user => user.name === crntUser);

      const tmpVotedMenus = [];
      for (const user of this.voteObj.votedUsers) {
        tmpVotedMenus.push(...user.votedMenus);
      }
      this.voteObj.votedMenus = [...new Set(tmpVotedMenus)];

      const feildList = [];
      for (const menu of this.voteObj.votedMenus) {
        const foundUsers = this.voteObj.votedUsers.filter(user => {
          return user.votedMenus.find(votedMenu => votedMenu === menu);
        });
        let userStr = ''
        for (const user of foundUsers) {
          userStr = `${user.name} `
        }
        const fieldObj = {
          title: menu,
          value: userStr
        }
        feildList.push(fieldObj);
      }
      
      const allMenus = this.voteObj.voteMenus;
      const voteMenus = [];
      for (const menu of allMenus) {
        const buttonObj = {
          name: 'sendVote',
          type: 'button',
          text: menu,
          value: menu,
          style: 'default'
        }
        if (userVoted.votedMenus.find(votedMenu => votedMenu === menu)) {
          buttonObj.style = 'primary';
        }
        voteMenus.push(buttonObj);
      }
      const response: ResponseDto = {
        text: `오늘의 카페 : ${this.voteObj.cafeName}`,
        callbackId: 'voteParent',
        responseType: 'ephemeral',
        attachments: [
          {
            callbackId: 'voteMenu',
            actions: voteMenus
          },
          {
            fields: feildList,
          },
          {
            actions: [
              {
                callbackId: 'endVote',
                name: 'endVote',
                type: 'button',
                text: '투표 종료',
                value: 'endVote'
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
}
