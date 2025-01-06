import { Pipe, PipeTransform } from '@angular/core';
import { Util } from '../utils/util';

@Pipe({
  name: 'fromSnakeCase',
  standalone: true
})
export class FromSnakeCasePipe implements PipeTransform {

  transform(value: any): string {
    if (!value) return value;
    if (typeof value !== 'string') {
      return ''
    }
    return Util.fromSnakeCase(value)
  }

}
