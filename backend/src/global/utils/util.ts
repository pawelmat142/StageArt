export abstract class Util {

    public static formatDate(date: Date): string {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JavaScript
        const year = String(date.getFullYear()).slice(-4); // Get last two digits of the year
        return `${day}-${month}-${year}`;
    }

    static toKebabCase(input: string): string {
        return input
          .replace(/([a-z])([A-Z])/g, "$1-$2") // Add a dash between lowercase and uppercase letters.
          .replace(/\s+/g, '-') // Replace spaces with dashes.
          .toLowerCase(); // Convert the entire string to lowercase.
      }
    
}
    