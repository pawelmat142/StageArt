import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fromCamel',
  standalone: true
})
export class FromCamelToTextPipe implements PipeTransform {

  transform(value: any): string {
    if (!value) return value;
    if (typeof value !== 'string') {
      return ''
    }

    // Replace camelCase with a space before each uppercase letter
    return value
      .replace(/([A-Z])/g, ' $1')  // Add space before uppercase letters
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
  }

}
