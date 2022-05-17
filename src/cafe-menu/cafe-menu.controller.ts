import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CafeMenuService } from './cafe-menu.service';
import { ValidationPipe } from './cafe-menu.validation.pipe';
import { RequestDto } from './dto/request.dto';

@Controller('einz-cafe')
export class CafeMenuController {
  constructor(private readonly cafeMenuService: CafeMenuService) {}
  @Post('')
  async controlActions(
    @Body(new ValidationPipe()) body: RequestDto,
    @Res() response: Response,
  ): Promise<void> {
    let isError = body.isError;
    const { text } = body;
    const splited = text.split(' ');
    const filtered = splited.filter(val => val.startsWith('--'));
    const mapped = filtered.map(val => {
      const tmp = val.trim();
      return tmp.slice(2);
    })
    isError = !mapped || mapped.length === 0;
    const actionName = mapped[0];
    const actions = splited.slice(1);
    if (actionName === 'register') {
      response.status(HttpStatus.OK).json(await this.cafeMenuService.registerCafeMenu(actions));
    } else if (actionName === 'update') {

    } else if (actionName === 'delete') {

    } else if (actionName === 'getTitles') {

    } else if (actionName === 'getMenus') {
      response.status(HttpStatus.OK).json(await this.cafeMenuService.getOneCafeMenu(actions));
    } else if (actionName === 'vote') {

    } else {
      isError = true;
    }
    if (isError) {
      response.status(HttpStatus.OK).json({
        text: `액션을 정확히 입력해주세요.\nEX) --register, --getTitles, --getMenus`,
        responseType: 'ephemeral',
      });
    }
  }
}
