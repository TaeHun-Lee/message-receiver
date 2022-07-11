import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const { text } = value;
    const splited = text.split(' ');
    const filtered = splited?.filter((val) => val.startsWith('--'));
    const mapped = filtered?.map((val) => val?.trim()?.slice(2));

    const errObj = {
      isError: false,
      errMsg: null,
    };
    const noMsgErr = typeof text !== 'string' || text.length === 0;
    const noActionNameErr =
      !filtered || filtered.length === 0 || !mapped || mapped.length === 0;

    const noActionErr =
      ((mapped[0] === 'add' ||
        mapped[0] === 'addMenu' ||
        mapped[0] === 'deleteMenu') &&
        splited?.slice(1).length <= 1) ||
      ((mapped[0] === 'delete' ||
        mapped[0] === 'getMenu' ||
        mapped[0] === 'vote') &&
        (splited?.slice(1).length === 0 || splited?.slice(1).length > 1)) ||
      (mapped[0] === 'get' && splited?.slice(1).length > 0);

    if (noMsgErr || noActionNameErr || noActionErr) {
      errObj.isError = true;
      if (noActionErr) {
        errObj.errMsg = {
          text: `액션을 정확히 입력해주세요.\nEX) --액션 카페이름 카페메뉴1 카페메뉴2\n혹은 --액션 카페이름`,
          responseType: 'ephemeral',
        };
      }
      if (noActionNameErr) {
        errObj.errMsg = {
          text: `액션명을 정확히 입력해주세요.\nEX) --add --get --delete --addMenu --getMenu --deleteMenu --vote`,
          responseType: 'ephemeral',
        };
      }
      if (noMsgErr) {
        errObj.errMsg = {
          text: `인수를 정확히 입력해주세요.\nEX) --액션 카페이름 카페메뉴1 카페메뉴2\n혹은 --액션 카페이름`,
          responseType: 'ephemeral',
        };
      }
    }
    const actions = splited?.slice(1)?.map((val) => val.replace(/["']/g, ''));
    value.errObj = errObj;
    value.actionName = mapped[0];
    value.actions = actions;
    return value;
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}

@Injectable()
class ImValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const { actionName, callbackId } = value;

    const errObj = {
      isError: false,
      errMsg: null,
    };

    if (!actionName || !callbackId) {
      errObj.isError = true;
      errObj.errMsg = {
        text: `에러가 발생했습니다.`,
        responseType: 'ephemeral',
      };
    }

    value.errObj = errObj;
    return value;
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}

export { ValidationPipe, ImValidationPipe };
