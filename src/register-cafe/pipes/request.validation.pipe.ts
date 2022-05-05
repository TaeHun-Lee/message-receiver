import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
} from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
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
