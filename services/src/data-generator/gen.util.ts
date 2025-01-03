export abstract class Gen {

    public static get NOW(): Date {
        return new Date()
    }

    public static plusDays(days: number): Date {
        const result = this.NOW
        result.setDate(result.getDate() + days)
        return result
    }

    public static plusMonths(months: number): Date {
        const result = this.NOW
        result.setMonth(result.getMonth() + months)
        return result
    }
}