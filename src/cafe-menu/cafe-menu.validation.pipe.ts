import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
} from '@nestjs/common';

@Injectable()
class RegisterCafeValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const { text } = value;
    const textSplited = text.split(' ');
    const isError = textSplited.length < 2;
    if (isError) {
      return {
        isError: true,
        text: `'제목 메뉴' 형태로 입력해주십시오.`,
      }
    }
    return value;
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}

class CafeValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const { text } = value;
    const isError = typeof text !== 'string' || text.length === 0;
    if (isError) {
      return {
        isError: true,
        text: `카페 이름을 정확히 입력해주세요.`,
      }
    }
    return value;
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}

class InterActiveValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const { actionValue } = value;
    const isError = typeof actionValue !== 'string' || actionValue.length === 0;
    if (isError) {
      return {
        isError: true,
        text: `잘못된 액션입니다.`,
      }
    }
    return value;
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}

export { RegisterCafeValidationPipe, CafeValidationPipe, InterActiveValidationPipe }