export abstract class Theme {

    public static cssVar(name: string, value: string) {
        document.documentElement.style.setProperty(`--${name}`, value);
    }

    public static setTheme(theme: Object) {
        Object.entries(theme).forEach(([key, value]) => {
            Theme.cssVar(key, value)
        })
    }
}