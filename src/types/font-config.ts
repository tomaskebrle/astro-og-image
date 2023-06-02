import {CanvasKit} from "canvaskit-wasm";
import {RGBColor} from "./for-html";

export interface FontConfig {
    /** RGB text color. Default: `[255, 255, 255]` */
    color?: RGBColor;
    /** Font size. Title default is `70`, description default is `40`. */
    size?: number;
    /** Font weight. Make sure you provide a URL for the matching font weight. */
    weight?: Exclude<keyof CanvasKit['FontWeight'], 'values'>;
    /** Line height, a.k.a. leading. */
    lineHeight?: number;
    /**
     * Font families to use to render this text. These must be loaded using the
     * top-level `fonts` config option.
     *
     * Similar to CSS, this operates as a “font stack”. The first family in the
     * list will be preferred with next entries used if a glyph isn’t in earlier
     * families. Useful for providing fallbacks for different alphabets etc.
     *
     * Example: `['Noto Sans', 'Noto Sans Arabic']`
     */
    families?: string[];
}
