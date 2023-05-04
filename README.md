# Midjourney Archive Chrome Extension

I got a bit tired of Midjourney's limited and buggy archive download solution so
I decided to put together a quick and dirty chrome extension with GPT-4.

It currently downloads only upscaled images. Tested only with v5 images for now.

Make sure you're logged into Midjourney, otherwise this won't work.

## TODO

[ ] Add image settings (prompt, aspect ratio etc) as metadata/properties to the png images before download.
[ ] Improve logo

## Development

After modifying `src/popup.js`, run `npm run build` to update `dist/popup.js`.
