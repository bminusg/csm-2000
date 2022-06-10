# Creative Solution Manager 2000

The Creative Solution Manager 2000 provides a working environment for your Advertising Creatives on your local machine. This tool uses modern Frontend technologies to build lightweight Creatives and brings a library for reusable Features.

## Requirements

- nodeJS

## Install

1. Clone the repository to your local machine `git clone git@github.com:bminusg/csm-2000.git`
2. Go to project folder `cd csm-2000`
3. Install all your dependencies `npm install`

## NPM Scripts

- `npm run develop` Runs local web development server on your machine
- `npm run bundle` run CLI helper for bundling your final static creative files
- `npm run create-project` run CLI helper for creating a new project and his templates
- `npm run update-project` run CLI helper for updating an excisting project

## Getting started

The Bundler need one entry point for recognizing your Creative. Please ensure that the following file exist on your creative folder `main.js`.

### Entrypoint main.js

The main Creative file relates all your dependencies from default tracking logic over your custom stylings to your custom actions.
Furthermore, this file defines all the Modules that you need for example Styles and Features.

```JS
import Creative from "src/creative";  // Init Creative Object
import "./markup.html"                // Your Creative Markup
import "./sass/main.sass"             // Your Style files

new Creative({
  brand: "[YOUR BRAND NAME]",
  campaign: "[YOUR CAMPAIGN NAME]",
  format: "[YOUR FORMAT SLUG]",
  features: []
});

```

### Entrypoint index.html

This file defines your custom Markup. You can use `npm run template` to create your HTML Entrypoint dynamically.

## Features

The idea for feature integration is to encapsulate default logic from custom functionality. Another obstacle is to prevent blowing up the final creative JS file size. We only want to integrate code which we only need in the live environment. The following docs give an instruction how to use the features

### Parallax

Parallax feature provides an opportunity to transform HTMLElements parallax using CSS variables like var(--parallax-00-x) on Mousemove Event

```JS
import Parallax from "lib/features/Parallax";

new Creative({
  features: [
    new Parallax()
  ]
});
```

#### Options `Type: Object`

|                 Name                 |    Type    |                 Default                 | Description                                   |
| :----------------------------------: | :--------: | :-------------------------------------: | :-------------------------------------------- |
|         **`options.offset`**         | `number[]` |                  [0,0]                  | adding/substract from mouse position [X,Y]    |
|       **`options.maxOffset`**        |  `number`  |                   50                    | max pixel amount for moving                   |
| **`options.crossSiteCommunication`** |  `Object`  |               undefinded                | dispatch custom crossSiteCommunictation event |
|        **`options.viewport`**        | `number[]` | [window.innerWidth, window.innerHeight] | amount of viewport                            |
|     **`options.parallaxRatios`**     | `number[]` |             [0.2, 0.6, 0.9]             | calculation parallax pixel ratios             |

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

#### Options `Type: Object`

|             Name              |         Type         |      Default      | Description                                                                                                                    |
| :---------------------------: | :------------------: | :---------------: | :----------------------------------------------------------------------------------------------------------------------------- |
|   **`options.isAutoplay`**    |     `{Boolean}`      |       false       | Plays video without interaction and muted                                                                                      |
|    **`options.isLooped`**     |     `{Boolean}`      |       false       |                                                                                                                                |
|    **`options.fileURLs`**     |  `{Array[String]}`   |        []         | Required. List of URL paths pointing to the video media file                                                                   |
|   **`options.classNames`**    |      `{String}`      | "creative--video" |                                                                                                                                |
|      **`options.video`**      | `{HTMLMediaElement}` |     undefined     | You can use an excisting <video></video> Element as Video container. If it is undefined the feature will build a video element |
| **`options.parentContainer`** |   `{NodeElement}`    |      <body>       | The video event listeners send feedback to the parent container as data attributes.                                            |
|     **`options.btnPlay`**     |   `{NodeElement}`    |     undefined     | Append click event listener to Node Element for playing the video                                                              |
|    **`options.btnPause`**     |   `{NodeElement}`    |     undefined     | Append click event listener to Node Element for pausing the video                                                              |
|   **`options.btnSoundOn`**    |   `{NodeElement}`    |     undefined     | Append click event listener to Node Element for unmuting the video                                                             |
|   **`options.btnSoundOff`**   |   `{NodeElement}`    |     undefined     | Append click event listener to Node Element for muting the video                                                               |

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

#### Options `Type: Object`

|             Name              |        Type         |  Default  | Description                                                                                                                                                                                                                                                                                                                                 |
| :---------------------------: | :-----------------: | :-------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
|   **`options.connectWith`**   |   `Array[String]`   | undefined | Required. String concatenation from your Creative frame ID's which you want to connect.                                                                                                                                                                                                                                                     |
|     **`options.timeout`**     |      `Number`       |   3000    | Define a Millisecond value for how long the Creative is allowed to search for a connection.                                                                                                                                                                                                                                                 |
|     **`options.methods`**     | `Object{functions}` | undefined | On this property, you can define your custom methods that are executable from external creatives.                                                                                                                                                                                                                                           |
| **`options.hasDefaultEvent`** |      `Boolean`      |   false   | This option delivers the opportunity for cross-site communication. If this option is true, it will append a custom event listener to the creative container. Dispatching this event will trigger the method on your target creative. If the data option is not defined, the event will try to get all datasets from the creative container. |

##### hasDefaultEvent documentation

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

##### methods documentation

2 methods are defined already:

1. `start(): function` method executes every creative after the connection is successful.
2. `set(options: Object): function` method will call the target creatives

- targets `Type: Array[String]` list of creative ID's
- method `Type: String` target method that should be executed
- data `Type: any` your arguments on your target method

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

This feature uses markup trigger items that call your custom action on autorotate or mouseover interaction. Use cases can be something like Interaction Points on your Creative to show different product features. If one of your triggers is activated you can call your custom function

```JS
import Rotate from "lib/features/Rotate";

new Creative({
  features: [
    new Rotate({
      triggers: ".creative--triggers",
  ]
});

```

#### Options `Type: Object`

|           Name           |                         Type                          |  Default  | Description                                                                                                                                                                                                                                                                                                                 |
| :----------------------: | :---------------------------------------------------: | :-------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  **`options.triggers`**  |                       `String`                        | undefined | Query selector of markup node elements. The number of these elements will define the loop length and get `.is--active` on active state. It is recommended to use data-attributes on the trigger elements.                                                                                                                   |
| **`options.slideCount`** |                       `Number`                        |   null    | If no HTML Element Triggers are needed you need only to define a number of slides                                                                                                                                                                                                                                           |
|   **`options.action`**   | `function(trigger: nodeElement, target: nodeElement)` | undefined | This action is called on every rotate update. As parameter you will get the active trigger element and your target node element. You have the possibillity to access the data attributes from your trigger element and can change data attributes on your target element. This will help to different slide stages via CSS. |
|   **`options.target`**   |                       `String`                        |  "body"   | The target nodeElement can change Styling via data-attribute stages                                                                                                                                                                                                                                                         |
| **`options.maxRounds`**  |                       `Number`                        |     0     | The number of loop rounds. 0 means infinite loop                                                                                                                                                                                                                                                                            |
|  **`options.loopTime`**  |                   `Array: [Number]`                   |  [2500]   |

Defining the offset time between every trigger change. It is number of milliseconds in an array. If only one number is defined in the array it will be used for every trigger element. You can define different times for every trigger by concatning numbers in order of your trigger elements. For example if the second trigger wait time should be 4 seconds you can use `loopTime: [2500, 4000]`
|
|**`options.autoRotate`**|`Boolean`|false|If the rotate should not be initiated by the user and start autmaticly you can set autoRotate on `true`|
|**`options.delay`**|`Number`|600|Wait time before auto rotate will be initiated|
|**`options.mouseoverEvent`**|`Boolean`|true|
Append a mouseover event listener to every trigger element|
|**`options.clickControllers`**|`String`|""|If you want to controll the rotate with click controller, you need to define your query selector of your node elements. On default, the rotate directions is defined from the markup order. If you click on the first element the direction will be backwards. You can change the default order by setting a `data-direction="previous || next"` to the node element|

## Ideation

- VPAID Player
- Auto archiving
