export abstract class DateUtil {
  public static get NOW(): Date {
    return new Date();
  }

  public static afterDays(days: number): Date {
    return this.addDays(this.NOW, days);
  }

  public static afterMonths(months: number, days?: number): Date {
    return this.addMonths(this.NOW, months, days);
  }

  public static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  public static addMonths(date: Date, months: number, days?: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    if (days) {
      result.setDate(result.getDate() + days);
    }
    return result;
  }
}
