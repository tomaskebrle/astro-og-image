import * as fs from "fs";
import puppeteer from "puppeteer";
import { fileURLToPath } from "node:url";
import glob from "glob";
import type { AstroIntegration, RouteData } from "astro";

type matchedPathType = {
    pathname: string;
    regex: RegExp | undefined;
    namePrefix: string | undefined;
};
type matchesConfigType = {
    regex: RegExp;
    namePrefix: string;
};

export default function OGImageGenerator({
                                         config,
                                     }: {
    config: { path: string; matches: matchesConfigType[] };
}): AstroIntegration {
    return {
        name: "og-image-generator",
        hooks: {
            "astro:build:done": async ({ dir, routes }) => {
                printRoutePatterns(routes);
                let path = config.path;
                let matches = config.matches;
                console.log("matches", matches);
                let filteredRoutes = routes.filter((route) => route?.component?.includes(path));
                const allPageFiles = await glob.glob(`${dir.pathname}${config.path}/**/*.html`, { ignore: '1/**' });
                console.log("allPageFiles",allPageFiles);
                const filteredPatternsRoutes = allPageFiles
                    .map((pathname) => {
                        const matchRelPath = pathname.match(/\bdist([^<]+)index.html/);
                        console.log("matchRelPath", matchRelPath);
                        const relativePath = matchRelPath ? matchRelPath[1] : "";
                        const aMatch = matches.find((x) => {
                            return new RegExp(x.regex).test(relativePath);
                        });
                        const { regex } = aMatch;
                        return {
                            pathname,
                            regex: aMatch?.regex,
                            namePrefix: aMatch?.namePrefix,
                        };
                    })
                    .filter((x, index: number) => x.regex);

                await generateOgImage(
                    matches ? filteredPatternsRoutes : filteredRoutes,
                    path,
                    dir
                );
            },
        },
    };
}

async function generateOgImage(
    filteredRoutes: RouteData[] | matchedPathType[],
    path: string,
    dir: any
) {
    // Creates a directory for the images if it doesn't exist already
    let directory = fileURLToPath(new URL(`./assets/${path}`, dir));
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, {recursive: true});
    }

    const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        headless: "new",
    });
    for (const route of filteredRoutes) {
        const { pathname, namePrefix }: any = route;

        // Skip URLs that have not been built (draft: true, etc.)
        if (!pathname) continue;

        const data = fs.readFileSync(pathname as any, "utf-8") as any;
        let htmlTitle = await data.match(/<title[^>]*>([^<]+)<\/title>/)[1];
        // let res = await data.match(/\bdata-og="([^<]+)"/)[1];
        let res = await data.match(/<div id="og-script"[^>]*>([^<]+)<\/div>/)[1];
        let title, thumbnail;
        if (res) {
            const configData = JSON.parse(res);
            // console.log(res);
            // console.log(configData);
            console.log(configData.thumbnail);
            title = configData.title;
            // thumbnail = configData.thumbnail;
        }

        // Get the html
        const html = fs
            .readFileSync("og-image.html", "utf-8")
            .toString()
            .replace("@title", title || htmlTitle);
            // .replace("@thumbnail", thumbnail);

        const page = await browser.newPage();
        await page.setContent(html);
        await page.waitForNetworkIdle();
        await page.setViewport({
            width: 1200,
            height: 630,
        });

        await page.screenshot({
            path: fileURLToPath(
                new URL(`./assets/${namePrefix}${pathname.split("/").at(-2)}.png`, dir)
            ),
            encoding: "binary",
        });
    }
    await browser.close();
}

function printRoutePatterns(routes: RouteData[]) {
    console.log("For astro-og-image, Routes Patterns to copy: ==========");
    routes.forEach((x) => {
        console.log("template/page: ", x.route);
        console.log("regex: ", x.pattern);
        console.log(" ");
    });
}
