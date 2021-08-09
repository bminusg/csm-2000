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
import "./sass/main.sass" // Your Style files

new Creative({
  brand: "[YOUR BRAND NAME]",
  campaign: "[YOUR CAMPAIGN NAME]",
  format: "[YOUR FORMAT SLUG]",
  // OPTIONAL
  publisher: "",
});

```

### Entrypoint index.html

This file is needed for defining your custom Markup. You can use `npm run template` creating your HTML Entrypoint dynamicly.

## Features

The idea for feature integration is to encapsulate default logic from custom functionality. Another obstacle is to prevent blowing up the final creative JS filesize. We only want to integrate code which we only need in live environment. The following docs give an instruction how to integrate Features

### Cross Site Connection

If you have multiple frames on one impression you can connect them and run animation synchronisly or you can interact between frames. You only have to define on every Creative the Creative slugs which you wanna connect.

```JS
import CrossSiteConnection from "lib/features/CrossSiteConnection";

new Creative({
  features: [
    new CrossSiteConnection({
      connectWith: ["slug-creative-2", "slug-creative-3"]
    })
  ]
});

```

#### Options `type: Object`

##### connectWith `type: Array[String], required`

String concatination from your Creative frame ID's who should be connected to your Creative.

##### timeout `type: Number, Default: 3000`;

Define a Milisecond value for how long the Creative is allowed to search for a connection.

##### methods `type: Object[function]`

These properties defines your custom cross functions. For initialising you should define your function on the `start` property.
In case you want to interact with different Creatives you have to call on Creative-A `this.set(options)`. The options object contains your options.targets `type:Array[String]` and a options.method `type: String` identifier which method should be executed on Creative-B

```JS
// ----- Creative A
new Creative({
  slug: "creative_a",
  features: [
    new CrossSiteConnection({
      connectWith: ["creative_b"],
      methods: {
        start() {
          this.set({
            targets: ["creative_b"],
            methods: "changeBgColor",
            data: "purple"
          })
        }
      }
    })
  ]
});


// ----- Creative B
new Creative({
  slug: "creative_b",
  features: [
    new CrossSiteConnection({
      connectWith: ["creative_a"],
      methods: {
        changeBgColor(data) {
          const container = document.querySelector(".creative");
          container.style.backgroundColor = data;
        }
      }
    })
  ]
});

```

### Rotate

This feature uses markup trigger items that call your custom action on autorotate or mouseover interaction. Usescases can be for example something like Interaction Points on your Creative to show different product features. If one of your trigger is active you can call your custom function

```JS
import Rotate from "lib/features/Rotate";

new Creative({
  features: [
    new Rotate({
      triggers: document.querySelectAll(".creative--triggers") // NodeList
      action: () => {}, // function(Active Trigger Index: number, Target: NodeElement)

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
- Auto archiving
