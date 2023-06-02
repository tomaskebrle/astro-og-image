[![Node.js Package](https://github.com/CyberKoalaStudios/og-image-generator/actions/workflows/npm-publish.yml/badge.svg?event=deployment_status)](https://github.com/CyberKoalaStudios/og-image-generator/actions/workflows/npm-publish.yml)

# :rocket: Astro Open Graph Image Generator
An astro integration to generate static Open Graph images from Content Collections, at build time

[![Example of generated image](https://i.ibb.co/vL2mVTz/articles-test.png)](https://cyberkoalastudios.com)


## Installation
```bash
npm i @cyberkoalastudios/og-image-generator
```
## Usage
### Creating an OpenGraph image endpoint
1. Create a new file in your `src/pages/` directory. For example, `src/pages/custom-open-graph/[...route].ts`.
2. Use the `OGDynamicImageRoute` helper to create `getStaticPaths` and `get` functions for you:

````typescript
import {OGDynamicImageRoute} from '@cyberkoalastudios/og-image-generator';


export const {getStaticPaths, get} = OGDynamicImageRoute({
    // Tell us the name of your dynamic route segment.
    // In this case it’s `route`, because the file is named `index.ts`.
    param: 'route',

    // A collection of pages to generate images for.
    // This can be any map of paths to data, not necessarily a glob result.
    
    pages: await import.meta.glob('/src/content/articles/**/*.md', {eager: true}),
    // For each page, this callback will be used to customize the OpenGraph
    // image. For example, if `pages` was passed a glob like above, you
    // could read values from frontmatter.
    getImageOptions: (path, page) => ({
        title: page.frontmatter.title,
        description: page.frontmatter.description,
        logo: {
            path: './src/favicon.png',
        },
        backgroundImage: {
            url: page.frontmatter.image?.url,
            alpha: 0.2,
            blurStrength: 3,
        },
        // There are a bunch more options you can use here!
        bgGradient: [[26, 26, 26], [24, 24, 24]],
        /** Border config. Highlights a single edge of the image. */
        border: {
            /** RGB border color, e.g. `[0, 255, 0]`. */
            color: [76, 0, 153],

            /** Border width. Default: `0`. */
            width: 15,

            /** Side of the image to draw the border on. Inline start/end respects writing direction. */
            side: "block-end",
        },

        font: {
            title: {
                families: ['Open Sans','Ubuntu','Istok Web','Source Sans Pro', 'PT Serif', 'Andika']
            },
            description: {
                families: ['Open Sans','Ubuntu','Istok Web','Source Sans Pro', 'PT Serif', 'Andika']
            }
        },
        

    }),
});
````

Example of `post.md`:

```astro
---
title: My test post
author: LRN4
description: "CyberKoala LLC"
image:
  url: "https://avatars.githubusercontent.com/u/104198244?s=200&v=4.jpg"
  alt: "Image alt"
pubDate: 2023-06-01
tags: ["vr","education","tech"]
draft: false
---
# Rate this package

Some text
```

### Image Options

Your `getImageOptions` callback should return an object configuring the image to render. Almost all options are optional.

````typescript
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
         * - `[width]` — Resize to the specified width, height will be
         *               resized proportionally.
         * - `[width, height]` — Resized to the specified width and height.
         */
        size?: [width?: number, height?: number];
    };
    /** Optional background image. Displayed as cover of the card. */
    backgroundImage?: {
        size?: [width?: number, height?: number];
        /** Path to the bg image file, e.g. `'./src/bg.png'`  or `page.frontmatter.image?.url`*/
        url: string;
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
}

````

#### `FontConfig`
````typescript
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

````

<div style="page-break-after: always;"></div>

---
# (Deprecated)

# Setup
## Prerequisites

You will need an astro site with a blog. And then you need to install [og-image-generator package](https://www.npmjs.com/package/@cyberkoalastudios/og-image-generator).

### Make sure that you have content collections. 
This plugin **works only with [Content Collections](https://docs.astro.build/en/guides/content-collections/)**, not static Pages

```bash
npm i @cyberkoalastudios/og-image-generator
pnpm add @cyberkoalastudios/og-image-generator
yarn add @cyberkoalastudios/og-image-generator
```
 
## Folder structure
Change `articles` to your collection name. 
You should have folder structure like this:

```bash
src
├───content
│   ├───articles
│   │   ├───2023
│   │   │   ├───05
│   │   │   └───06
|   |   |   |   |----post.md
```

Example of `post.md`:
```markdown
---
title: My test post
author: LRN4
description: "CyberKoala LLC"
image:
  url: "https://avatars.githubusercontent.com/u/104198244?s=200&v=4.jpg"
  alt: "Image alt"
pubDate: 2023-06-01
tags: ["vr","education","tech"]
draft: false
---
# Rate this package

Some text
```

## Adding json+ld script to your BaseHead
Example of `ArticleHeadJSONLD.astro` (it can be BaseHead, but we name it as ArticleHeadJSONLD)

```astro
---
export interface Props {
    title: string;
    description: string;
    slug: string;
}

const { title, description, pubDate, slug } = Astro.props;
const ogFromSlug = slug !== undefined ? new URL(`/assets/articles-${slug}.png`, Astro.site) : new URL(`/social-image.png`, Astro.site)

const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    datePublished: pubDate?.toISOString().substring(0, 10),
    image: [ogFromSlug],
    author: [
        {
            "@type": "Person",
            name: "LRN4",
            url: "https://lrn4.ru",
            type: "Organization",
        },
    ],
    publisher: {
        "@type": "Organization",
        name: "CYBERKOALA LLC",
        logo: {
            "@type": "ImageObject",
            url: "https://avatars.githubusercontent.com/u/104198244?s=200&v=4",
        },
    },
    mainEntityOfPage: {
        "@type": "webPage",
        id: Astro.url,
    },
});
---

<script type="application/ld+json" set:html={schema} />
```

`MarkdownArticleDynamicLayout.astro`:
```astro
---
import ContentLayoutArticle from "./ContentLayoutArticle.astro";
const {frontmatter, slug} = Astro.props;
---
<ContentLayoutArticle pageTitle={frontmatter.title} pubDate={frontmatter.pubDate}
                      imageUrl={frontmatter.image?.url ?? `/social-image.png`}
                      description={frontmatter.description} tags={frontmatter.tags}
                      slug={slug}
>
    <article>
        ...
        <div class="flex-col pt-4">{frontmatter.pubDate.toLocaleDateString()}</div>
        ...
    </article>
</ContentLayoutArticle>
```
_Its recommended that you use a fallback image for all the non posts pages, and in case something goes wrong._


`ContentLayoutArticle.astro`:
```astro
---
import ArticleHeadJSONLD from "../components/headers/ArticleHeadJSONLD.astro";
const {pageTitle, pubDate, description, slug} = Astro.props;
---
<html lang="en">
    <head>
        <ArticleHeadJSONLD title={pageTitle} description={description} pubDate={pubDate} slug={slug}/>
    </head>
    <body>
        ...
    </body>
</html>
````

## Config
Now you will need to import the integration into your astro config

```astro
import {defineConfig} from "astro/config";
import OGImageGenerator from "@cyberkoalastudios/og-image-generator";
export default defineConfig({
  integrations: [
      ...
          
      OGImageGenerator({
          config: {
              path: "/articles",
              matches: [
                  {
                      regex: new RegExp('(?<!\/)\\[^\/\.][^\.:]*$'), // This one if for searching html (rendered .md files)
                      namePrefix: "articles"                         // This one is for prefixing images
                  },
                  // This can be array of objects with different regular expressions. Feel free to add more here
              ],
              imagePosition: 0, // index of <img> tag in rendered html page. If you have multiple images in post, choose featured to render as background
              // make sure to match sizes with styles in og-image.html
              imageSize: {
                  width: 1200,
                  height: 630
              },
              regexes: {
                  ldJson: RegExp('/(?<=<script type="application\\/ld\\+json">)(.*?)(?=<\\/script>)/'), // selector of inner data from ldJson (to extract title of post)
                  image: RegExp('(?<=<img[^>]*src="([^"]+)"[^>]*>)'),                                   // selector of all image tags (to extract image at imagePosition)
              }
          }
      }),
      
      ...
  ],
});
```

## Creating template for the image

The image will be created by screenshotting an HTML page. The integration will load the HTML from `og-image.html` file, so create one **in the root directory** and put your template inside.
Required to have `@title` and `@thumbnail`, rest is on your chose. Feel free to customize this template.

```astro
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta content="IE=edge" http-equiv="X-UA-Compatible"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>OG Preview Page</title>
</head>
    <body>
        <header class="container noise3">
            <img src="@thumbnail"
                 alt="thumbnail"
                 class="image-from-post"
            >
            <section class="logo">
                <img src="https://lrn4.ru/favicon.png"
                     alt="logo">
            </section>
            <section class="text">
                <h1>@title</h1>
            </section>
            <section class="bottom-line"></section>
        </header>
    </body>
<style>
    body {
        margin: 0;
    }

    /* Container holding the image and the text */
    header {
        overflow: hidden;
        background: black;
        text-align: left;
        width: 1200px;
        height: 630px;
    }

    .text {
        position: absolute;
        top: 180px;
        left: 100px;
        width: 1000px;
        height: 630px;
        white-space: pre-line;
        line-height: 1.2;
        font-size: 26px;
        color: whitesmoke;
    }

    /* Dimmed image */
    .image-from-post {
        object-fit: cover;
        opacity: 0.9;
        width: 1200px;
        height: 630px;
        filter: blur(3px) saturate(50%) brightness(0.2);

    }

    .logo {
        position: absolute;
        top: 80px;
        left: 100px;
    }

    .noise3{
        background: rgb(0, 0, 0, 0.7) url("data:image/svg+xml,%3C!-- svg: first layer --%3E%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    }

    .bottom-line {
        position: relative;
        bottom: 20px;
        border-block-end: 2rem solid;
        writing-mode: horizontal-tb;
        width: 1200px;
        color: rgb(76, 0, 153);
    }
</style>
</html>
```

Note that the `@title` and `@thumbnail` will then be replaced by the title and image at position `imagePosition` of your post.

## Final steps

Great now you should be done!🎉 Deploy your site and test it out. Great site for testing this out is [Open Graph previewer](https://www.opengraph.xyz/).

---
Improvements:

- [ ] Add generation from markdown via `gray-metter` `dayjs`
