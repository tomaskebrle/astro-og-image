import {configType, imageSizeType} from "./types/config-type";
import {AstroIntegration, RouteData} from "astro";
import {glob} from "glob";
import {matchedPathType} from "./types/matched-path-type";
import {matchesConfigType} from "./types/matches-config-type";
import {regexesType} from "./types/regexes-type";
import {fileURLToPath} from "node:url";
import fs from "fs";
import puppeteer from "puppeteer";

// export { generateOpenGraphImage } from './generateOpenGraphImage';
// export { OGDynamicImageRoute } from './routing';


export default function OGImageGenerator({ config, } : { config: configType}): AstroIntegration {
    return {
        name: "astro-og-image",
        hooks: {
            "astro:build:done": async ({ dir, routes }) => {
                let path = config.path;
                let matches = config.matches;
                let imagePosition = config.imagePosition;
                let filteredRoutes = routes.filter((route : RouteData) => route?.component?.includes(path));
                const allPageFiles = await glob.glob(`${dir.pathname}${config.path}/**/*.html`, { ignore: '1/**' });
                const filteredPatternsRoutes: matchedPathType[] = allPageFiles
                    .map((pathname): matchedPathType  => {
                        const matchRelPath = pathname.match(/\bdist([^<]+)index.html/);
                        const relativePath = matchRelPath ? matchRelPath[1] : "";
                        const aMatch: matchesConfigType | undefined = matches.find((x) => {
                            return new RegExp(x.regex).test(relativePath);
                        });
                        return {
                            pathname,
                            regex: aMatch?.regex,
                            namePrefix: aMatch?.namePrefix,
                        };
                    })
                    .filter((x, index:number) => x.regex);
                await generateOgImage(matches ? filteredPatternsRoutes : filteredRoutes, path, dir, imagePosition, config.imageSize, config.regexes);
            },
        },
    };
}
async function generateOgImage(filteredRoutes: RouteData[] | matchedPathType[],
                               path: string,
                               dir: any,
                               imagePosition: number,
                               imageSize: imageSizeType | {width: 1200; height: 630},
                               regexes: regexesType
) {
    // Creates a directory for the images if it doesn't exist already
    let directory = fileURLToPath(new URL(`./assets/${path}`, dir));
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
    const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        headless: "new",
    });
    for (const route of filteredRoutes) {
        const { pathname, namePrefix }: any = route;
        console.log("Processing: ", pathname, "namePrefix", namePrefix);
        // Skip URLs that have not been built (draft: true, etc.)
        if (!pathname)
            continue;
        const data = fs.readFileSync(pathname, "utf-8");
        let htmlTitle = await data.match(/<title[^>]*>([^<]+)<\/title>/)?.[1];
        let ldJson = await data.match(regexes.ldJson);
        let imageTags = await data.match(regexes.image);

        let title, thumbnail;
        if (ldJson) {
            const configData = JSON.parse(ldJson[0]);
            title = configData.headline;
        }
        if (imageTags) {
            thumbnail = imageTags[imagePosition];
        }

        // Get the html
        const html = fs
            .readFileSync("og-image.html", "utf-8")
            .toString()
            .replace("@title", title || htmlTitle)
            .replace("@thumbnail", thumbnail || '');
        const page = await browser.newPage();
        await page.setContent(html);
        await page.waitForNetworkIdle();
        await page.setViewport({
            width: imageSize.width,
            height: imageSize.height,
        });
        const fileToCreate = fileURLToPath(new URL(`./assets/${namePrefix}-${pathname.split("\\").at(-2)}.png`, dir));
        await page.screenshot({
            path: fileToCreate,
            encoding: "binary",
        });
    }
    await browser.close();
}

// Debug
function printRoutePatterns(routes: RouteData[]) {
    console.log("For astro-og-image, Routes Patterns to copy: ==========");
    routes.forEach((x) => {
        console.log("template/page: ", x.route);
        console.log("regex: ", x.pattern);
        console.log(" ");
    });
}
