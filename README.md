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
- `npm run template` run CLI helper for creating your creative entry points from the template

## Getting started

The Bundler needs at least 2 entry points for recognizing your Creative. Please ensure that the following files exist on your creative folder `index.html`, `main.js`.

### Entrypoint main.js

The main Creative file relates all your dependencies from default tracking logic over your custom stylings to your custom actions.
Furthermore, this file defines all the Modules that you need for example Styles and Features.

```JS
import Creative from "src/creative";  // Init Creative Object
import "./sass/main.sass"             // Your Style files

new Creative({
  brand: "[YOUR BRAND NAME]",
  campaign: "[YOUR CAMPAIGN NAME]",
  format: "[YOUR FORMAT SLUG]",
  // OPTIONAL
  publisher: "",
  features: []
});

```

### Entrypoint index.html

This file defines your custom Markup. You can use `npm run template` to create your HTML Entrypoint dynamically.

## Features

The idea for feature integration is to encapsulate default logic from custom functionality. Another obstacle is to prevent blowing up the final creative JS file size. We only want to integrate code which we only need in the live environment. The following docs give an instruction how to use the features

### Video Player

Generates a plain video player

```JS
import Video from "lib/features/Video";

new Creative({
  features: [
    new Video({
      isAutoplay: true,
      fileURLs: ["http://example.com/media/spot.mp4", "http://example.com/media/spot.webm"]
    })
  ]
});
```

#### Options `type: Object`

##### isAutoplay `type: Boolean, Default: false`

##### isLooped `type: Boolean, Default: false`

##### fileURLs `type: Array[String], required`

List of URL paths pointing to the video media file

##### video `type: NodeElement, Default: undefined`

You can use an excisting <video></video> Element as Video container. In default case the feature will build a video element

##### parentContainer `type: NodeElement, Default: <body>`

The video event listeners send feedback to the parent container as data attributes.

###### btnPlay `type: NodeElement, Default: undefined`

Append click event listener to Node Element for playing the video

###### btnPause `type: NodeElement, Default: undefined`

Append click event listener to Node Element for pausing the video

###### btnSoundOn `type: NodeElement, Default: undefined`

Append click event listener to Node Element for unmuting the video

###### btnSoundOff `type: NodeElement, Default: undefined`

Append click event listener to Node Element for muting the video

### Cross Site Connection

If you have multiple frames on one ad impression you can connect them to run your animation synchronously and interact between the frames. You only have to define on every Creative the Creative slugs which you want to connect.

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

String concatenation from your Creative frame ID's which you want to connect.

##### timeout `type: Number, Default: 3000`;

Define a Millisecond value for how long the Creative is allowed to search for a connection.

##### hasDefaultEvent `type: Boolean, Default: false`

This option delivers the opportunity for cross-site communication. If this option is true, it will append a custom event listener to the creative container. Dispatching this event will trigger the method on your target creative. If the data option is not defined, the event will try to get all datasets from the creative container.

```JS
// ----- CREATIVE A

// DEFINE CUSTOM EVENT FOR CROSS COMMUNICATION
const event = new CustomEvent("crossSiteCommunication", {
  detail: {
    targets: ["creative_b"],
    method: "changeBgColor",
    data: "purple"
  },
});

// DISPATCH EVENT
window.Creative.container.dispatchEvent(event);

```

##### methods `type: Object[function]`

On this property, you can define your custom methods that are executable from external creatives. 2 methods are defined already:

1. `start(): function` method executes every creative after the connection is successful.
2. `set(options: Object): function` method will call the target creatives

- targets `type: Array[String]` list of creative ID's
- method `type: String` target method that should be executed
- data `type: any` your arguments on your target method

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
            method: "changeBgColor",
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

This feature uses markup trigger items that call your custom action on autorotate or mouseover interaction. Use cases can be something like Interaction Points on your Creative to show different product features. If one of your triggers is active you can call your custom function

```JS
import Rotate from "lib/features/Rotate";

new Creative({
  features: [
    new Rotate({
      triggers: ".creative--triggers",              // Class name of markup trigger node elements
      action: () => {},                             // function(trigger:NodeElement, target: NodeElement)

      // OPTIONAL
      target: document.querySelector(".creative"),  // NodeElement, default div.creative
      maxRounds: 0,                                // number of rounds, 0 means infinite
      loopTime: [2500],                            // Array:number millisecond timeoffset between trigger change
      autoRotate: false,                           // boolean that indicates if rotating starts automatic
      delay: 600
    })
  ]
});

```

## Ideation

- VPAID Player
- Preview
- Auto archiving
