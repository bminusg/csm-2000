# Creative Solution Manager 2000

The Creative Solution Manager 2000 provides a working environment for your Advertising Creatives on your local machine. This tool uses modern Frontend technologies to build lightweight Creatives and brings a library for reusable Features.

## Requirements

- nodeJS

## Install

1. Clone the repository to your local machine `git clone git@github.com:bminusg/csm-2000.git`
2. Go to project folder `cd csm-2000`
3. Install all your dependencies `npm install`

## NPM Scripts

- `npm run serve` Runs local web development server on your machine
- `npm run build` run CLI helper for bundling your final static creative files
- `npm run template` run CLI helper for creating your creative entrypoints from template

## Getting started

The Bundler needs at least 2 entrypoints for recognizing your Creative. Please ensure that following files excist on your creative folder `index.html`, `main.js`.

### Entrypoint main.js

The main Creative file relates all your dependencies from for example default trackinging logic over your custom stylings to your custom actions.
Furthermore this file defines all your Modules that you need for example Styles and Features.

```JS
import Creative from "src/creative"; // Init Creative Object
import "./less/main.less" // Your Style files

new Creative({
  brand: "[YOUR BRAND NAME]",
  campaign: "[YOUR CAMPAIGN NAME]",
  format: "[YOUR FORMAT SLUG]",
  // OPTIONAL
  publisher: "",
});

```

### Entrypoint index.html

This file is needed for defining your custom Markup. You can use `npm run template` or use your own HTML file for example:

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

### Rotate

This feature uses markup trigger items that call your custom action on autorotate or mouseover interaction. Usescases can be for example something like Interaction Points on your Creative to show different product features. If one of your trigger is active you can call your custom function

```JS
import Rotate from "lib/features/rotate"; // Init Creative Object
import yourCustomAction from "./js/yourCustomAction";

new Creative({
  features: [
    new Rotate({
      triggers: document.querySelectAll(".creative--triggers") // NodeList
      action: yourCustomAction, // function(Active Trigger Index: number, Target: NodeElement)

      // OPTIONAL
      target: document.querySelector(".creative"), // NodeElement, default div.creative
      maxRounds = 0, // number of rounds, 0 means infinite
      loopTime = 2500, // :number millisecond timeoffset between trigger change
      autoRotate = false, // boolean that indicates if rotating starts automatic
    })
  ]
});

```

## Ideation

- VPAID Player
- Preview
- Assets Minifier
- Auto archiving
