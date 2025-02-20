import { $desktop } from "../tools/media-query";
import { ImgSize } from "../utils/img.util";
import { DefaultTheme } from "./default.theme";
import { UnityTheme } from "./unity.theme";

export abstract class Theme {

    private static readonly THEME_STORAGE_KEY = 'THEME'

    private static readonly DEFAULT_THEME = UnityTheme

    public static get currentTheme(): string {
        return localStorage.getItem(Theme.THEME_STORAGE_KEY) || this.DEFAULT_THEME.name
    }

    public static cssVar(name: string, value: string) {
        if (value) {
            document.documentElement.style.setProperty(`--${this.toKebabCase(name)}`, value);
        } else {
            document.documentElement.style.removeProperty(`--${this.toKebabCase(name)}`);
        }
    }

    public static initTheme() {
        const theme = this.selectThemeByName(Theme.currentTheme)
        Theme.setTheme(theme)
        this.initScssVariables()
    }

    private static initScssVariables() {
        Theme.cssVar('avatar-size',`${ImgSize.avatarMobile.height}px`)
        Theme.cssVar('avatar-size-desktop',`${ImgSize.avatar.height}px`)
        Theme.cssVar('is-desktop', $desktop.toString())
      }

    public static setTheme(theme: Object) {
        Object.entries(theme).forEach(([key, value]) => {
            Theme.cssVar(key, value)
        })
    }

    public static switchTheme() {
        const name = this.currentTheme === DefaultTheme.name ? UnityTheme.name : DefaultTheme.name
        const theme = Theme.selectThemeByName(name)
        Theme.setTheme(theme)
        localStorage.setItem(Theme.THEME_STORAGE_KEY, name)
    }

    private static selectThemeByName(name: string): Object {
        switch (name) {
            case DefaultTheme.name: return DefaultTheme
            case UnityTheme.name: return UnityTheme
            default: return this.DEFAULT_THEME
        }
    }

    private static toKebabCase(camelCaseStr: string): string {
        return camelCaseStr
            .replace(/([a-z])([A-Z])/g, '$1-$2') // Handles camelCase
            .replace(/([a-zA-Z])(\d)/g, '$1-$2') // Handles transitions from a letter to a digit
            .toLowerCase();
    }

    public static getProperty(name: string): string {
        const root = document.documentElement
        const styles = getComputedStyle(root)
        const value = styles.getPropertyValue(`--${this.toKebabCase(name)}`)
        if (!value) {
            throw new Error(`Not found css property ${name}`)
        }
        return value
    }
}