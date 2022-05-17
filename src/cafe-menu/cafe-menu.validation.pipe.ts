import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
} from '@nestjs/common';

@Injectable()
class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const { text } = value;
    const splited = text.split(' ');
    const filtered = splited?.filter(val => val.startsWith('--'));
    const isError = typeof text !== 'string' || text.length === 0 || filtered == null || filtered == undefined || filtered.length === 0;
    if (isError) {
      return {
        isError: true,
      }
    }
    return value;
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}

export { ValidationPipe }