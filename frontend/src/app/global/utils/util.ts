import { environment } from "../../../environments/environment";

export abstract class Util {

    public static readonly apiUri = ['localhost', '127.0.0.1'].some(u => location.hostname.includes(u))
        ? environment.testApiUri 
        : environment.apiUri

    public static capitalizeFirstLetter(input: string = '') {
        if (input.length === 0) return input; // Return the empty string as-is
        return input.charAt(0).toUpperCase() + input.slice(1);
    }

    public static formatDate(date: Date): string {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JavaScript
        const year = String(date.getFullYear()).slice(-4); // Get last two digits of the year
        return `${day}-${month}-${year}`;
    }

    public static fromSnakeCase(input: string): string {
        let words = input.split('_');
        if (words.length) {
            words[0] = this.capitalizeFirstLetter(words[0])
        }
        return words.join(' ');
    }

    public static isDate(input: any): boolean {
        return input instanceof Date || !isNaN(Date.parse(input))
    }

    public static get<T>(item: any, path: string): T | string {
        const properties = path.split('.');
        let current: any = item;
    
        for (const prop of properties) {
            if (current == null || !current.hasOwnProperty(prop)) {
              return '-'
            }
            current = current[prop];
        }
        return current;
    }

}