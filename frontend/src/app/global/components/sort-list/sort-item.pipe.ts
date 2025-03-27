import { Pipe, PipeTransform } from '@angular/core';
import { SortLabel } from './sort-list.component';
import { DatePipe } from '@angular/common';
import { Util } from '../../utils/util';

@Pipe({
  name: 'sortItem',
  standalone: true,
})
export class SortItemPipe implements PipeTransform {

  constructor(
    private datePipe: DatePipe
  ) {}

  transform(item: any, label: SortLabel): string | null {

    let result = Util.get<string>(item, label.itemPath) as Date | string | number

    if (label.itemPipe) {
      if (label.itemPipeArgs) {
        result = label.itemPipe.transform(result, ...label.itemPipeArgs)
      } else {
        result = label.itemPipe.transform(result, )
      }
    }

    if (Util.isDate(result)) {
      return this.datePipe.transform(result)
    }

    return result as string
  }

}
