import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CafeMenuService } from './cafe-menu.service';
import { ValidationPipe } from './cafe-menu.validation.pipe';
import { InterActiveRequestDto, RequestDto } from './dto/request.dto';

@Controller('einz-cafe')
export class CafeMenuController {
  constructor(private readonly cafeMenuService: CafeMenuService) {}
  @Post('')
  async controlActions(
    @Body(new ValidationPipe()) body: RequestDto,
    @Res() response: Response,
  ): Promise<void> {
    if (body.errObj?.isError) {
      response.status(HttpStatus.OK).json(body.errObj.errMsg);
      return;
    }

    const { actionName, actions } = body;

    if (actionName === 'add') {
      response.status(HttpStatus.OK).json(await this.cafeMenuService.addCafe(actions));
    } else if (actionName === 'get') {
      response.status(HttpStatus.OK).json(await this.cafeMenuService.getCafe());
    } else if (actionName === 'delete') {
      response.status(HttpStatus.OK).json(await this.cafeMenuService.delete(actions));
    } else if (actionName === 'addMenu') {
      response.status(HttpStatus.OK).json(await this.cafeMenuService.addMenu(actions));
    } else if (actionName === 'getMenu') {
      response.status(HttpStatus.OK).json(await this.cafeMenuService.getMenu(actions));
    } else if (actionName === 'deleteMenu') {
      response.status(HttpStatus.OK).json(await this.cafeMenuService.deleteMenu(actions));
    } else if (actionName === 'vote') {
      response.status(HttpStatus.OK).json(await this.cafeMenuService.vote(actions));
    }
  }

  @Post('im')
  async controlInteractiveMessage(
    @Body() body: InterActiveRequestDto,
    @Res() response: Response,
  ): Promise<void> {
    // if (body.errObj?.isError) {
    //   response.status(HttpStatus.OK).json(body.errObj.errMsg);
    //   return;
    // }

    console.log('body -- ', body);
  }
}
