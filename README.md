# Astro Open Graph Image
Generate static open graph images with this astro integration

# Setup

## Install
Once you have astro configured install this package
```bash
npm i astro-og-image
pnpm add astro-og-image
yarn add astro-og-image
```

## Enable `experimental-integrations` flag
Because astro is still in beta you will have to `--experimental-integrations` flag to the build command in `package.json` like this
```json
"build": "astro build --experimental-integrations",
```

## Import the package in `astro.config.mjs`
```js
import { defineConfig } from "astro/config";
import astroOGImage from "astro-og-image";

// https://astro.build/config
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

## Create template for the image
Create a `og-image.html` file in the root directory of you project. This HTML will then be saved as the Open Graph image. It will generate the image using the title of your post. To get the title into the HTML you need to put `@title` to the place where you want the title to go.

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

