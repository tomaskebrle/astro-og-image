import * as fs from "fs";
import puppeteer from "puppeteer";
import { fileURLToPath } from "node:url";
import type { AstroIntegration, RouteData } from "astro";

/* interface Options {
  config: {
    path: string;
  };
} */

export default function astroOGImage(options: {
  config: { path: string };
}): AstroIntegration {
  return {
    name: "astro-og-image",
    hooks: {
      "astro:build:done": async ({ dir, routes }) => {
        let path = options.config.path;
        // Filters all the routes that need OG image
        let filteredRoutes = routes.filter((route: RouteData) =>
          route?.pathname?.includes(path)
        );

        // Creates a directory for the images if it doesn't exist already
        let directory = fileURLToPath(new URL(`./assets${path}`, dir));
        if (!fs.existsSync(directory)) {
          fs.mkdirSync(directory);
        }

        const browser = await puppeteer.launch();
        for (const route of filteredRoutes) {
          // Gets the title
          const data = fs.readFileSync(
            route?.distURL?.pathname as any,
            "utf-8"
          ) as any;
          let title = await data.match(/<title[^>]*>([^<]+)<\/title>/)[1];

          // Get the html
          const html = fs
            .readFileSync("og-image.html", "utf-8")
            .toString()
            .replace("@title", title);

          const page = await browser.newPage();
          await page.setContent(html);
          await page.waitForNetworkIdle();
          await page.setViewport({
            width: 1200,
            height: 630,
          });

          await page.screenshot({
            path: fileURLToPath(new URL(`./assets${route.pathname}.png`, dir)),
            encoding: "binary",
          });
        }
        await browser.close();
      },
    },
  };
}
