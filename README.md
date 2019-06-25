# Mavo Cropper

![Cropper](/screenshots/Preview.png)

*****Credits*****: The image in the screenshot is taken from [here](https://fengyuanchen.github.io/cropperjs/).

Simply add the plugin to your app to enable Cropper functionality on **every image property**.

Cropper supports:

- cropping
- rotation
- flipping
- zooming (either by wheeling mouse or by touch).

There is a couple of things you should know before starting working with Cropper:

- use `Shift` key while *resizing* existing cropping box to preserve its aspect ratio
- use `Shift` key while *creating* new cropping box to get the square one
- use `double click` to switch between *moving* a crop box and *panning* an image (when it is zoomed in)

## Customize Cropper

Cropper supports [a bunch of options for customizing the way it works](https://github.com/fengyuanchen/cropperjs#options). You can specify these options on a per-property basis by using the `mv-cropper-options` attribute.
The syntax of this attribute is a CSS-like list of declarations, where you can use either commas or semicolons to separate the *option-value pairs*, like so: `mv-cropper-options="autoCrop: false, aspectRatio: 1.6"`. If you want to set an option to `true`, you can just provide no value.

## UI customization: Toolbar

![Toolbar](/screenshots/Toolbar.png)

You can use these [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_variables) in your CSS (via `var(--variable-name)`) to customize the toolbar.

| Name | Value |
| ---- | ----- |
| `--rotate-left-btn` | data URI of Cropper rotate left icon |
| `--rotate-right-btn` | data URI of Cropper rotate right icon |
| `--flip-horizontal-btn` | data URI of Cropper flip horizontal icon |
| `--flip-vertical-btn` | data URI of Cropper flip vertical icon |
| `--crop-btn` | data URI of Cropper crop icon |
| `--upload-btn` | data URI of Cropper upload icon |
| `--update-btn` | data URI of Cropper update icon |

You may also find useful the `cropper-preview` class for styling the preview area.

## UI customization: Text & Localization

Your app needs to be in a different language? No problem! You can customize every bit of Cropper displayed text, whether that is to change the text displayed to your liking or to localize it to a different language.

Here is the list of `id`s of phrases to change/localize and their default values:

| id | Default Value |
|---|---|
| `cropper-image-preview` | Image preview |
| `cropper-upload` | Upload Image |
| `cropper-show` | Show Crop Box |
| `cropper-hide` | Hide Crop Box |
| `cropper-rotate-left` | Rotate Left |
| `cropper-rotate-right` | Rotate Right |
| `cropper-flip-horizontal` | Flip Horizontal |
| `cropper-flip-vertical` | Flip Vertical |
| `cropper-aspect-ratio` | Crop Box Aspect Ratio |
| `cropper-update` | Update Preview |
