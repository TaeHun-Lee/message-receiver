import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CafeMenuService } from './cafe-menu.service';
import { ImValidationPipe, ValidationPipe } from './cafe-menu.validation.pipe';
import { InterActiveRequestDto, RequestDto } from './dto/request.dto';

@Controller('einz-cafe')
export class CafeMenuController {
  constructor(private readonly cafeMenuService: CafeMenuService) {}
  @Post('')
  async controlActions(
    @Body(new ValidationPipe()) body: RequestDto,
    @Res() response: Response,
  ): Promise<void> {
    // Validation Pipe에서 에러 검증하여 에러 객체 추가
    if (body.errObj?.isError) {
      response.status(HttpStatus.OK).json(body.errObj.errMsg);
      return;
    }

    const { actionName, actions } = body;

    if (actionName === 'add') {
      // 카페 추가
      response
        .status(HttpStatus.OK)
        .json(await this.cafeMenuService.addCafe(actions));
    } else if (actionName === 'get') {
      // 전체 카페 조회
      response.status(HttpStatus.OK).json(await this.cafeMenuService.getCafe());
    } else if (actionName === 'delete') {
      // 카페 삭제
      response
        .status(HttpStatus.OK)
        .json(await this.cafeMenuService.delete(actions));
    } else if (actionName === 'addMenu') {
      // 카페 개별 메뉴 추가
      response
        .status(HttpStatus.OK)
        .json(await this.cafeMenuService.addMenu(actions));
    } else if (actionName === 'getMenu') {
      // 카페 전체 메뉴 조회
      response
        .status(HttpStatus.OK)
        .json(await this.cafeMenuService.getMenu(actions));
    } else if (actionName === 'deleteMenu') {
      // 카페 개별 메뉴 삭제
      response
        .status(HttpStatus.OK)
        .json(await this.cafeMenuService.deleteMenu(actions));
    } else if (actionName === 'vote') {
      // 카페로 투표 생성
      response
        .status(HttpStatus.OK)
        .json(await this.cafeMenuService.vote(actions));
    }
  }

  @Post('im') // Button에 반응하는 경우만 처리
  async controlInteractiveMessage(
    @Body(new ImValidationPipe()) body: InterActiveRequestDto,
    @Res() response: Response,
  ): Promise<void> {
    // Validation Pipe에서 에러 검증하여 에러 객체 추가
    if (body.errObj?.isError) {
      response.status(HttpStatus.OK).json(body.errObj.errMsg);
      return;
    }
    response
      .status(HttpStatus.OK)
      .json(await this.cafeMenuService.voteIm(body));
  }
}
