# vue-plugin-ecss

## Summarize

#### This is a plugin that automatically generates styles based on the style class name of the specified format.

## Installation

```sh
npm install vue-plugin-ecss
```

## Usage in Vite

```js
import { vitePluginVueEcss } from "vue-plugin-ecss";

export default {
  plugins: [
    vitePluginVueEcss({
      /* config */
    }),
  ],
};
```

## Usage in Webpack

```js
const { WebpackPluginVueEcss } = require("vue-plugin-ecss");

module.exports = defineConfig({
  configureWebpack: {
    plugins: [new WebpackPluginVueEcss()],
  },
});
```

## Configuration

```js
vitePluginVueEcss({
  /**
  * The output style file name. Default 'ecss.css' ， choosable => 'css' | 'less' | 'scss' | 'sass'
  * */
    fileName: string,

  /**
   * This is the default separator '--' between prefix and name attribute,
   * with space and -invalid This is the default separator '--' between prefix and name attribute, with space and -invalid.
   * */
    attrDecollator: string

  /**
   *   The class name matches the prefix. Default  'ecss'
   * */
    prefix: string

  /**
   * The output path of the style file. Default  './' + fileName .
   * Note: When this value is set, the values of fileName are reassigned with the corresponding string from the path.
   * The plug-in creates a file based on the path, and you can import the file into your project
   * */
    outputPath：string
}),

```

## class edit

```html
<div class="ecss--w-100px--h-100px ecss--mg-20px-10px"></div>
```

## The resulting style file is as follows

```css
.ecss--w-100px--h-100px {
  width: 100px !important;
  height: 100px !important;
}
.ecss--mg-20px-10px {
  margin: 20px 10px !important;
}
```

# Tips：When you need to set a color, the color value in your class name does not need to be written with a # sign, for example:

```html
<div class="ecss--fs-20px--color-blue ecss--bgc-ff0000"></div>
```

## The resulting style file is as follows

```css
.ecss--fs-20px--color-blue {
  font-size: 20px !important;
  color: blue !important;
}
.ecss--bgc-ff0000 {
  background-color: #ff0000 !important;
}
```
