# :rocket: Astro Open Graph Image Generator
An astro integration to generate static Open Graph images from Content Collections, at build time

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
title: Rate this package
author: LRN4
description: "CyberKoala LLC"
image:
  url: "https://lrn4.ru/LRN4_mail-ldjson.png"
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
const ogFromSlug = slug !== undefined ? new URL(`/assets/articles/articles-${slug}.png`, Astro.site) : new URL(`/social-image.png`, Astro.site)

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
                      regex: new RegExp('/^\\/articles\\/?$/\n'), // This one if for searching html (rendered .md files)
                      namePrefix: "articles"                      // This one is for prefixing images
                  },
                  // This can be array of objects with different regular expressions. Feel free to add more here
              ]
          }
      }),
      
      ...
  ],
});
```

## Creating template for the image

The image will be created by screenshotting an HTML page. The integration will load the HTML from `og-image.html` file, so create one **in the root directory** and put your template inside.

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
        <h1>@title</h1>
        <img alt="thumbnail-alt" src="@thumbnail"/>
    </body>
</html>

```

Note that the `@title` and `@thumbnail` will then be replaced by the title of your post.


And modify the BaseHead component meta tags.
_I recomennd that you use a fallback image for all the non posts pages, and in case something goes wrong._

```astro
---
export interface Props {
	title: string;
	description: string;
	slug: string;
}
const { title, description, slug, publishDate } = Astro.props;
---

<meta property="og:image" content={slug !== undefined ? `/assets/your-posts-folder/${slug}.png` : `/assets/fallback-image.png`} />
<meta property="twitter:image" content={slug !== undefined ? `/assets/your-posts-folder/${slug}.png` : `/assets/fallback-image.png`} />
```


## Final steps

Great now you should be done!🎉 Deploy your site and test it out. Great site for testing this out is [Open Graph previewer](https://www.opengraph.xyz/).


