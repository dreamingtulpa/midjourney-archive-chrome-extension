# Midjourney Archive Chrome Extension

I got a bit tired of Midjourney's limited and buggy archive download solution so
I decided to put together a quick and dirty chrome extension with GPT-4.

It currently downloads only upscaled images. Tested only with v5 images for now.

Make sure you're logged into Midjourney, otherwise this won't work.

## Metadata

Metadata for each job can be found in the `archived_jobs.json` file that gets
added to each generated zip file. To associate jobs to the image files, I've
added an `_archvied_files` attribute to each job that contains the downloaded image file names.

## TODO

[ ] Add image settings (prompt, aspect ratio etc) as metadata/properties directly to the png images.

## Development

After modifying `src/popup.js`, run `npm run build` to update `dist/popup.js`.
