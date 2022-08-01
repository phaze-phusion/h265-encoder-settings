# H265 Encoder Settings
This one page webapp translates/transforms MediaInfo settings to CLI and other formats (or vice versa)

Have you ever seen the work of another HEVC encoder and wished you could encode your own private videos with the same settings?
This little app can help you.

### How to use
1. Use MediaInfo (text view) and copy **ONLY** the _encoding settings_, which usuall starts with "wpp / ctu=64 ...""
2. Paste it in the _input_ area
3. Select your output options and copy the output to your app of choice

### Options
**Input recognized**
* MediaInfo
* CLI
* Tabular (Sheets or Excel)

**Defaults to include**
* None
* H265 Default
* Custom

Defaults are specified as JSON arrays in _/options.js_

**Output Formats**
* CLI
* Handbrake
* JSON
* Tabular
* MediaInfo

**Output Order**
* No Change
* StaxRip
* MediaInfo

Orders are specified as JSON arrays in _/options.js_

## This app requires Firefox or Chrome
See it in action http://phaze-phusion.co.za/h265-encoder-settings/

## License
This app is published under the terms of the [GNU General Public License v2](LICENSE).

### Libraries Used

* [jQuery](http://jquery.com/), MIT License
* [Bootstrap v4](https://v4-alpha.getbootstrap.com/), MIT License

### Referenced software
The following software is referred to in the app:
* [H.265](http://x265.org/)
* [StaxRip](https://github.com/stax76/staxrip)
* [MediaInfo](https://mediaarea.net/en/MediaInfo)
* [Handbrake](https://handbrake.fr/)

