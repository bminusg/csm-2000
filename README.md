# Creative Solution Manager 2000

The Creative Solution Manager 2000 provides a working environment for your Advertising Creatives on your local machine. This tool uses modern Frontend technologies to build lightweight Creatives and brings a library for reusable Features.

## Requirements

- nodeJS

## Install

1. Clone the repository to your local machine `git clone git@github.com:bminusg/csm-2000.git`
2. Go to project folder `cd csm-2000`
3. Install all your dependencies `npm install`

## Getting started

The Bundler needs at least 2 entrypoints for recognizing your Creative. Please ensure that following files excist on path `./src/2021/[CREATIVE PATHNAME]`: `index.html`, `main.js`.

### main.js

The main Creative file relates all your dependencies from for example default trackinging logic over your custom stylings to your custom actions.

```JS
import Creative from "lib/js/creative"; // Init Creative Object
import "./less/main.less"; // Init your style files

const creative = new Creative({
  brand: "[YOUR BRAND NAME]",
  campaign: "[YOUR CAMPAIGN NAME]",
  format: "[YOUR FORMAT NAME]",
});

window.addEventListener("DOMContentLoaded", creative.init());
```

### index.html

This file is needed for defining your Custom Markup. You can start with your own plain HTML file or you can use following template

```HTML
<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="ad.size" content="width=800, height=250" />
    <title>Creative</title>
    <link rel="icon" href="data:;base64,iVBORw0KGgo=">
  </head>
  <body>
    <a href="javascript:void(0)" class="creative--clicktag" target="_blank">
      <div class="creative creative--billboard"></div>
    </a>
  </body>
</html>
```

## Features

The idea for feature integration is to encapsulate default logic from custom functionality. Another obstacle is to prevent blowing up the final creative JS filesize. We only want to integrate code which we only need in live environment. The following docs give an instruction how to integrate Features

### Interactiv

The Interactive Feature brings the opportunity to interact with the Creative. Your custom action should work with 2 arguments, first argument is the trigger and second is your target which you can modify. For example you can get a value from your trigger data attribute and bring it to your target.

```JS
import Interactive from "lib/features/interactiv"; // DEFAULT INTERACTIVE FUNCTIONALITY FROM THE LIBRARY
import customFunction from "./js/customFunction"; // YOUR CUSTOM ACTION LOCATED ON CREATIVE FOLDER

new Interactive({
  // REQUIRED
  triggers: document.querySelectorAll(".interactive--trigger"),
  action: customFunction,

  // OPTIONAL
  target: document.querySelector(".creative--sitebar"), // Default .creative
  type: "click", // Default "click"
})
```

### Rotate

## Ideation

- VPAID Player
- Template Builder
- Preview
- Assets Minifier
- Auto archiving
