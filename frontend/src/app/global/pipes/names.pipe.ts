import { Pipe, PipeTransform } from '@angular/core';
import { SelectorItem } from '../interface';

@Pipe({
  name: 'names',
  standalone: true

})
export class NamesPipe implements PipeTransform {

  transform(value: SelectorItem[]): string {
    if (!value) return value;
    return value.map(i => i.name).join(', ')
  }

}
