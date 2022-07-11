import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CafeMenuRepository } from './cafe-menu.repository';
import { InterActiveRequestDto } from './dto/request.dto';
import { ResponseDto } from './dto/response.dto';

@Injectable()
export class CafeMenuService {
  // 로컬 투표 관련 객체
  // 카페명, 전체 카페 메뉴, 투표된 메뉴, 투표한 사람
  voteObj: {
    cafeName: string;
    voteMenus: Array<any>;
    votedMenus: Array<any>;
    votedUsers: Array<any>;
  };
  constructor(
    @InjectRepository(CafeMenuRepository)
    private cafeRepository: CafeMenuRepository,
    private readonly httpService: HttpService,
  ) {
    // 초기화
    this._initializeVoteObj();
  }
  // 카페 추가
  async addCafe(body: string[]): Promise<object> {
    const title = body[0]; // 카페 명
    const menus = body.slice(1); // 카페 메뉴
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
      lastUpdated: new Date(),
    });
    await this.cafeRepository.save(createdObj);
    const response: object = {
      text: '카페가 생성되었습니다.',
      responseType: 'ephemeral',
    };
    return response;
  }

  // 카페 메뉴 추가
  async addMenu(body: string[]): Promise<object> {
    const title = body[0]; // 카페 명
    const menus = body.slice(1); // 카페 메뉴
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
    const dupDeletedMenu = [...new Set(foundCafeMenu)]; // Set을 사용한 중복 제거
    foundCafe.menu = JSON.stringify(dupDeletedMenu);
    await this.cafeRepository.save(foundCafe);
    const response: object = {
      text: '카페 메뉴가 추가되었습니다. (자동으로 중복 제거)',
      responseType: 'ephemeral',
    };
    return response;
  }

  // 존체 카페 조회
  async getCafe(): Promise<object> {
    const foundCafes = await this.cafeRepository.query('SELECT * FROM cafe'); // Case-sensitive 주의
    const cafeParsed = foundCafes?.map((val) =>
      val.cafeName.replace(/["']/g, ''),
    ); // 따옴표 제거
    let cafes = '';
    for (const cafe of cafeParsed) {
      cafes = cafes.concat(cafe).concat(' ');
    }
    const response: object = {
      text: `${cafes}`,
      responseType: 'ephemeral',
    };
    return response;
  }

  // 카페 전체 메뉴 조회
  async getMenu(body: string[]): Promise<object> {
    const title = body[0]; // 카페 명
    const foundCafe = await this.cafeRepository.findOne(title);
    const { cafeName, menu } = foundCafe;
    const menuParsed = JSON.parse(menu)?.map((val) => val.replace(/["']/g, '')); // 따옴표 제거
    const response: object = {
      text: `${cafeName} - ${menuParsed}`,
      responseType: 'ephemeral',
    };
    return response;
  }

  // 카페 삭제
  async delete(body: string[]): Promise<object> {
    const title = body[0]; // 카페 명
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

  // 카페 개별 메뉴 삭제
  async deleteMenu(body: string[]): Promise<object> {
    const title = body[0]; // 카페 명
    const menus = body.slice(1); // 메뉴
    const foundCafe = await this.cafeRepository.findOne(title);
    if (!foundCafe) {
      const response: object = {
        text: '카페가 존재하지 않습니다.\n다른 카페 명을 입력해 주세요.',
        responseType: 'ephemeral',
      };
      return response;
    }
    const foundCafeMenu = JSON.parse(foundCafe.menu);
    const deletedCafeMenu = foundCafeMenu.filter((cafe) => {
      return !menus.includes(cafe);
    }); // 입력 받은 카페 메뉴를 제외한 메뉴 리스트
    const dupDeletedMenu = [...new Set(deletedCafeMenu)]; // Set을 사용한 중복 제거
    foundCafe.menu = JSON.stringify(dupDeletedMenu);
    await this.cafeRepository.save(foundCafe);
    const response: object = {
      text: '카페 메뉴가 삭제되었습니다. (자동으로 중복 제거)',
      responseType: 'ephemeral',
    };
    return response;
  }

  // 카페로 투표
  async vote(body: string[]): Promise<object> {
    const title = body[0]; // 카페 명
    const foundCafe = await this.cafeRepository.findOne(title);
    if (!foundCafe) {
      const response: object = {
        text: '카페가 존재하지 않습니다.\n다른 카페 명을 입력해 주세요.',
        responseType: 'ephemeral',
      };
      return response;
    }
    const menuList = JSON.parse(foundCafe.menu);
    // 투표 객체에 전체 메뉴와 카페 이름 할당
    this.voteObj.voteMenus = menuList;
    this.voteObj.cafeName = foundCafe.cafeName;

    // 카페 메뉴 필드 리스트 할당
    const voteMenus = [];
    for (const menu of menuList) {
      const buttonObj = {
        title: menu,
      };
      voteMenus.push(buttonObj);
    }

    const response: ResponseDto = {
      text: `오늘의 카페 : ${foundCafe.cafeName}`,
      callbackId: 'voteParent',
      responseType: 'inChannel',
      attachments: [
        {
          callbackId: 'voteMenu',
          fields: voteMenus,
        },
        {
          actions: [
            {
              callbackId: 'confirmVote',
              name: 'confrimVote',
              type: 'button',
              text: '투표 시작',
              value: 'confirmVote',
            },
            {
              callbackId: 'cancelVote',
              name: 'cancelVote',
              type: 'button',
              text: '투표 취소',
              value: 'cancelVote',
            },
          ],
        },
      ],
    };
    return response;
  }

  // 버튼 액션에 대한 처리
  async voteIm(body: InterActiveRequestDto): Promise<object> {
    // '투표 시작' 버튼인 경우
    if (body.actionValue === 'confirmVote') {
      // 카페 메뉴로 버튼 리스트 생성
      const menuList = this.voteObj.voteMenus;
      const voteMenus = [];
      for (const menu of menuList) {
        const buttonObj = {
          name: 'sendVote',
          type: 'button',
          text: menu,
          value: menu,
          style: 'default',
        };
        voteMenus.push(buttonObj);
      }

      const response: ResponseDto = {
        text: `오늘의 카페 : ${this.voteObj.cafeName}`,
        callbackId: 'voteParent',
        responseType: 'inChannel',
        attachments: [
          {
            callbackId: 'voteMenu',
            actions: voteMenus,
          },
          {
            actions: [
              {
                callbackId: 'confirmVote',
                name: 'confrimVote',
                type: 'button',
                text: '투표 종료',
                value: 'confirmVote',
              },
              {
                callbackId: 'cancelVote',
                name: 'cancelVote',
                type: 'button',
                text: '투표 취소',
                value: 'cancelVote',
              },
            ],
          },
        ],
      };
      return response;
    } else if (body.actionValue === 'cancelVote') {
      // '투표 취소' 버튼인 경우
      // 투표 객체 초기화
      this._initializeVoteObj();
      const response: object = {
        text: '투표가 취소되었습니다.',
        replaceOriginal: false,
        responseType: 'ephemeral',
      };
      return response;
    } else if (body.actionValue === 'endVote') {
      // '투표 종료' 버튼인 경우
      // 투표된 메뉴들의 필드 리스트를 반환
      const feildList = this._getMenusWithVotedUsers();
      const response: ResponseDto = {
        text: `오늘의 카페 : ${this.voteObj.cafeName}`,
        callbackId: 'voteParent',
        responseType: 'ephemeral',
        attachments: [
          {
            fields: [
              {
                title: '투표 종료',
                value: `총 투표 인원 수 : ${this.voteObj.votedUsers.length}`,
              },
            ],
          },
          {
            fields: feildList,
          },
        ],
      };
      // 투표 객체 초기화
      this._initializeVoteObj();
      return response;
    } else {
      // 이외 메뉴 관련 버튼일 경우
      // 현재 버튼을 누른 사람의 이름
      const crntUser = await this._getUserObjectFromDoorayApi(body.user);

      // 현재 버튼을 누른 사람이 이미 투표를 했는지 여부
      const userVotedIndex = this.voteObj.votedUsers.findIndex(
        (user) => user.name === crntUser,
      );

      // 현재 버튼을 누른 사람이 이미 투표를 했을 경우
      if (userVotedIndex > -1) {
        const voted = this.voteObj.votedUsers[userVotedIndex].votedMenus;
        // 현재 투표를 누른 사람이 투표했던 메뉴가 현재 누른 메뉴와 동일한 지 여부
        const indexIsAlreadyVoted = voted.findIndex(
          (voteMenu) => voteMenu === body.actionValue,
        );
        // 이미 눌렀던 메뉴라면
        if (indexIsAlreadyVoted > -1) {
          // 투표했던 메뉴 리스트에서 제거
          this.voteObj.votedUsers[userVotedIndex].votedMenus =
            this.voteObj.votedUsers[userVotedIndex].votedMenus.filter(
              (el) => el !== body.actionValue,
            );
        } else {
          // 새로운 메뉴라면 투표 했던 리스트에 새로 추가
          voted.push(body.actionValue);
          this.voteObj.votedUsers[userVotedIndex].votedMenus = voted;
        }
      } else {
        // 새로 투표하는 사람인 경우 투표한 사람 리스트에 추가
        this.voteObj.votedUsers.push({
          name: crntUser,
          votedMenus: [body.actionValue],
        });
      }

      // 투표된 메뉴 리스트에서 중복 제거
      const tmpVotedMenus = [];
      for (const user of this.voteObj.votedUsers) {
        tmpVotedMenus.push(...user.votedMenus);
      }
      this.voteObj.votedMenus = [...new Set(tmpVotedMenus)];

      // 투표한 사람들의 정보가 있는 투표된 메뉴들 리스트 필드
      const feildList = this._getMenusWithVotedUsers();

      const allMenus = this.voteObj.voteMenus;
      const voteMenus = [];
      for (const menu of allMenus) {
        // 기본 버튼 색은 회색
        const buttonObj = {
          name: 'sendVote',
          type: 'button',
          text: menu,
          value: menu,
          style: 'default',
        };
        // 순회 중인 메뉴가 현재 투표한 유저의 투표한 메뉴 리스트에 있을 경우 파란색 표시
        // 현재 버튼을 누른 사람이 이미 투표를 했는지 여부
        const userVoted = this.voteObj.votedUsers.find(
          (user) => user.name === crntUser,
        );
        if (userVoted.votedMenus.find((votedMenu) => votedMenu === menu)) {
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
            actions: voteMenus,
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
                value: 'endVote',
              },
              {
                callbackId: 'cancelVote',
                name: 'cancelVote',
                type: 'button',
                text: '투표 취소',
                value: 'cancelVote',
              },
            ],
          },
        ],
      };
      return response;
    }
  }

  // 투표된 메뉴들과 해당 메뉴 투표한 사람들 이름 필드 리스트 반환
  _getMenusWithVotedUsers(): Array<any> {
    // '투표 종료' 버튼인 경우
    // 투표된 메뉴들의 필드 리스트를 반환
    const feildList = [];
    // 이미 투표된 메뉴들 마다
    for (const menu of this.voteObj.votedMenus) {
      // 이미 투표한 유저가 투표한 메뉴인 경우
      const foundUsers = this.voteObj.votedUsers.filter((user) => {
        return user.votedMenus.find((votedMenu) => votedMenu === menu);
      });

      // 투표한 유저들 이름을 문자열에 추가
      let userStr = '';
      for (const user of foundUsers) {
        userStr = userStr.concat(user.name).concat(' ');
      }

      const fieldObj = {
        title: menu,
        value: userStr,
      };
      feildList.push(fieldObj);
    }
    return feildList;
  }

  // 투표 객체 초기화
  _initializeVoteObj(): void {
    this.voteObj = {
      cafeName: '',
      voteMenus: [],
      votedMenus: [],
      votedUsers: [],
    };
  }

  // 두레이 API로 이메일에 해당하는 현재 유저 이름 반환
  async _getUserObjectFromDoorayApi(user: any): Promise<string> {
    // 현재 버튼을 누른 사람의 이메일 조회
    const userEmail = user.email;
    const headersRequest = {
      'Content-Type': 'application/json',
      Authorization: `dooray-api j2id6kaltddi:CKP8nMaxQcCWpbbcDVbNpA`,
    };
    const userSearched = await this.httpService
      .get(
        `https://api.dooray.com/common/v1/members?externalEmailAddresses=${userEmail}`,
        {
          headers: headersRequest,
        },
      )
      .toPromise();
    const userName: string = userSearched?.data?.result?.find(
      (user) => user.externalEmailAddress === userEmail,
    )?.name;
    return userName;
  }
}
