import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    console.log('value --- ', value);
    console.log('metatype --- ', metatype);
    const { text } = value;
    const textSplited = text.splited(' ');
    const isError = textSplited.length > 1;
    if (isError) {
      throw new BadRequestException(`'제목 메뉴' 형태로 입력해주십시오.`);
    }
    return value;
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
