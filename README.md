# Human-First Search

Filter out AI-generated content from search engines.

## Download

<!-- prettier-ignore-start -->

| Firefox |
|---------|
| <p align="center"><a href="https://addons.mozilla.org/en-US/firefox/addon/human-first-search/"><img src="img/firefox.png"></a></p> |
| [Download](https://addons.mozilla.org/en-US/firefox/addon/human-first-search/) |

<!-- prettier-ignore-end -->

Or on a [release page](https://github.com/yureitzk/human-first-search/releases/latest)

## Description

This extension helps finding a human-made content, mostly relying on URL
parameters that certain search engines support.

You can customize the date range when the content was posted.

You can disable certain UI elements related to AI on search results pages.

You can exclude websites from your search results.

## Search Engines Support

<!-- prettier-ignore-start -->

|     | Date | Exclude/Include URLs | UI elements |
| --- | ---- | -------------------- | ----------- |
| Google| ✅ |  ✅                  | ✅          |
| DuckDuckGo| ✅ |  ✅                  | ✅          |
| Bing| ✅ |  ✅                  | ✅          |
| Brave| ✅ |  ✅                  | ✅          |

<!-- prettier-ignore-end -->

## Permissions

- `tabs`: For query parameters modifications in ManifestV3 browsers
- `webRequest` and `webRequestBlocking`: Monitor and modify URLs when needed
- `declarativeNetRequest`: Used in ManifestV3 browsers for creating network
  rules
- `storage`: Save and retrieve user preferences and settings

## Resources

Huge thanks to [Nicholas Taylor](https://nullhandle.org/) for
[his article about Bing Date Search Operators](https://nullhandle.org/blog/2024-06-12-exploring-the-bing-date-search-operators.html).
The best explanation for Bing search operators I've come across!

And thanks to [Zach](https://github.com/zbarnz)!
[Google AI Overviews Blocker](https://github.com/zbarnz/Google_AI_Overviews_Blocker)
was an inspiration for this project.

## Usage Notes

The extension manifest is defined in `src/manifest.js` and used by
`@samrum/vite-plugin-web-extension` in the vite config.

Background, content scripts, options, and popup entry points exist in the
`src/entries` directory.

Content scripts are rendered by `src/entries/contentScript/renderContent.js`
which renders content within a ShadowRoot and handles style injection for HMR
and build modes.

Otherwise, the project functions just like a regular Vite project.

To switch between Manifest V2 and Manifest V3 builds, use the `MANIFEST_VERSION`
environment variable defined in `.env`

HMR during development in Manifest V3 requires Chromium version >= 110.0.5480.0.

Refer to
[@samrum/vite-plugin-web-extension](https://github.com/samrum/vite-plugin-web-extension)
for more usage notes.

## Project Setup

```sh
npm install
```

You can customize your build via `.env` file

```conf
MANIFEST_VERSION=3
FIREFOX_BUILD=0
```

- `MANIFEST_VERSION` - manifest version you want to use (`2` or `3`)
- `FIREFOX_BUILD` - is the build for Firefox (`0` - no, `1` - yes)

## Project Setup

```sh
npm install
```

## Commands

### Build

#### Development, HMR

Hot Module Reloading is used to load changes inline without requiring extension
rebuilds and extension/page reloads Currently only works in Chromium based
browsers.

```sh
npm run dev
```

#### Development, Watch

Rebuilds extension on file changes. Requires a reload of the extension (and page
reload if using content scripts)

```sh
npm run watch
```

#### Production

Minifies and optimizes extension build

```sh
npm run build
```

### Load extension in browser

Loads the contents of the dist directory into the specified browser

```sh
npm run serve:chrome
```

```sh
npm run serve:firefox
```

## License

[GPLv3](LICENSE).
