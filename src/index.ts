import { glob } from "glob";
import type {AstroIntegration, RouteData} from "astro";
import {matchesConfigType} from "./types/matches-config-type";
import {configType} from "./types/config-type";
import {matchedPathType} from "./types/matched-path-type";
import {generateOgImage} from "./generateOgImage";

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

// Debug
function printRoutePatterns(routes: RouteData[]) {
    console.log("For astro-og-image, Routes Patterns to copy: ==========");
    routes.forEach((x) => {
        console.log("template/page: ", x.route);
        console.log("regex: ", x.pattern);
        console.log(" ");
    });
}
