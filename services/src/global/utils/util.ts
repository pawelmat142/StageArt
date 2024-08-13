export abstract class Util {

    public static formatDate(date: Date): string {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JavaScript
        const year = String(date.getFullYear()).slice(-4); // Get last two digits of the year
        return `${day}-${month}-${year}`;
    }
}
    