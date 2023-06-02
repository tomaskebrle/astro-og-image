import {CanvasKit} from "canvaskit-wasm";
import {LogicalSide, RGBColor} from "./for-html";
import {FontConfig} from "./font-config";

export interface OGImageOptions {
    /** Page title. */
    title: string;
    /** Short page description. */
    description?: string;
    /** Writing direction. Default: `'ltr'`. Set to `'rtl'` for Arabic, Hebrew, etc. */
    dir?: 'rtl' | 'ltr';
    /** Optional site logo. Displayed at the top of the card. */
    logo?: {
        /** Path to the logo image file, e.g. `'./src/logo.png'` */
        path: string;
        /**
         * Size to display logo at.
         * - `undefined` — Use original image file dimensions. (Default)
         * - `[width]` — Resize to the specified width, height will be resize proportionally.
         * - `[width, height]` — Resized to the specified width and height.
         */
        size?: [width?: number, height?: number];
    };
    /** Optional background image. Displayed as cover of the card. */
    backgroundImage? : {
        size?: [width?: number, height?: number];
        /** Path to the bg image file, e.g. `'./src/bg.png'`  or `page.frontmatter.image?.url`*/
        path: string;
    };
    /**
     * Array of `[R, G, B]` colors to use in the background gradient,
     * e.g. `[[255, 0, 0], [0, 0, 255]]` (red to blue).
     * For a solid color, only include a single color, e.g. `[[0, 0, 0]]`
     */
    bgGradient?: RGBColor[];
    /** Border config. Highlights a single edge of the image. */
    border?: {
        /** RGB border color, e.g. `[0, 255, 0]`. */
        color?: RGBColor;
        /** Border width. Default: `0`. */
        width?: number;
        /** Side of the image to draw the border on. Inline start/end respects writing direction. */
        side?: LogicalSide;
    };
    /** Amount of padding between the image edge and text. Default: `60`. */
    padding?: number;
    /** Font styles. */
    font?: {
        /** Font style for the page title. */
        title?: FontConfig;
        /** Font style for the page description. */
        description?: FontConfig;
    };
    /** Array of font URLs to load and use when rendering text. */
    fonts?: string[];
    /** Image format to save to. Default: `'PNG'` */
    format?: Exclude<keyof CanvasKit['ImageFormat'], 'values'>;
    /** Image quality between `0` (very lossy) and `100` (least lossy). Not used by all formats. */
    quality?: number;
}
