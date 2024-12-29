export abstract class DefaultTheme {

    public static readonly primaryColor = '';
    public static readonly primary600 = '';
    public static readonly primaryHover = '#2563eb';
    public static readonly secondaryColor = '#fff';

    public static readonly primaryColorText = ''; // bg

    public static readonly highlightBg = '';

    public static readonly bgTwo = '#fff';
    public static readonly bgTwoText = '#fff';

    public static readonly focusRing = '';
    public static readonly maskBg = '';

    // TXT
    public static readonly textColor = '';
    public static readonly textSecondaryColor = '#0f172a';
    
    // FORM
    public static readonly formBg = this.bgTwo;
    public static readonly formColor = this.textSecondaryColor;
    public static readonly formBorderColor = '#d1d5db';
    public static readonly formBorder = `1px solid ${this.formBorderColor}`;
    public static readonly formBorderActive = '#3B82F6';
    public static readonly formControlShadow = '#BFDBFE';

    public static readonly highlightTextColor = '';
    public static readonly fontFamily = '';
    public static readonly inlineSpacing = '';

    public static readonly borderRadius = '';
    public static readonly surfaceBorder = '#e2e8f0';
    public static readonly stepBorder = `1px solid ${this.surfaceBorder}`; //book form stepper 

    public static readonly input = '#e2e8f0';


    public static readonly grey = "#577483";
    public static readonly white = "#fff";
    public static readonly inputBg = "#f0edf2";

    public static readonly yellow = "#f9d85d";
    public static readonly yellowDark = "#f0c418";
    public static readonly yellowTransparent = "#f9d75d7e";
    public static readonly green = "#5a9a5b";
    public static readonly greenLight = "#6db16e";
    public static readonly greenDark = "#4b824c";

    public static readonly labelColor = "#aaa8ac";
    public static readonly controlBg = "#f0edf2";
    public static readonly borderColor = "#d3d3d3";

    public static readonly placeholderColor = "#757575";

    public static readonly chipColor = this.formControlShadow;

    public static readonly editButtonColor = this.yellow;
}