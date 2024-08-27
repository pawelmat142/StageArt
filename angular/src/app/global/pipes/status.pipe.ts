import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status',
  standalone: true

})
export class StatusPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;
    const splitted = value.split('_').join(' ')
    return splitted.charAt(0).toUpperCase() + splitted.slice(1).toLowerCase();
  }

}
