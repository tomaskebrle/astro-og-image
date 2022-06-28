# :rocket: Astro Open Graph Image
An astro integration to generate static Open Graph images, at build time

# Setup
## Prerequisites

You will need an astro site with a blog. And then you need to install [astro-og-image package](https://www.npmjs.com/package/astro-og-image).

```bash
npm i astro-og-image
pnpm add astro-og-image
yarn add astro-og-image
```

Lastly you need to add the `--experimental-integrations` flag to your scripts in `package.json`

```json
"scripts": {
  "dev": "astro dev --host --experimental-integrations",
  "start": "astro dev --experimental-integrations",
  "build": "astro build --experimental-integrations",
  "preview": "astro preview --experimental-integrations"
}
```
 
## Config
Now you will need to import the integration in astro config

```typescript
import {defineConfig} from "astro/config";
import astroOGImage from "astro-og-image";
export default defineConfig({
  integrations: [
    astroOGImage({
      config: {
        path: "/posts", // change this value to the folder where your posts are
        // NOTE: index.md file will not get proccesed, so please avoid it
      },
    }),
  ],
});
```

## Creating template for the image

As I stated before the image will be created by screenshotting an HTML page. The integration will load the HTML from `og-image.html` file, so create one **in the root directory** and put your template inside.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <h1>@title</h1>
  </body>
</html>
```


Note that the `@title` will then be replaced by the title of your post.

## Adding the Open Graph image property to your BaseHead

First of all you will need to add the slug property to your markdown files something like this

```md
---
title: My first
publishDate: 28 Jun 2022
description: The very first post on my new blog
slug: my-post // <-- NOTE: slug must be the same as file name
---
```


Then in your blogpost layout modify the BaseHead component to accept the slug as a parameter

```astro
---
const { title, description, publishDate, slug } = content; // Destructure it here
---

<html lang={content.lang || 'en'}>
	<head>
		<BaseHead {title} {description} {slug} {publishDate} /> <!-- Pass it here -->
```

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


