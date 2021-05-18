# Creative Solution Manager 2000

The Creative Solution Manager 2000 provides a working environment for your Advertising Creatives on your local machine. This tool uses modern Frontend technologies to build lightweight Creatives and brings a library for reusable Features.

## Requirements

- nodeJS

## Install

1. Clone the repository to your local machine `git clone`
2. Install all your dependencies at the project folder with `npm install`

## Getting started

### Build your Creative

```js
import "./less/main.less"; // Init your style files
import Creative from "lib/js/creative"; // Init Creative Object

const creative = new Creative({
  format: "[YOUR FORMAT NAME]",
  brand: "[YOUR BRAND NAME]",
  campaign: "[YOUR CAMPAIGN NAME]",
  features: {},
});

window.addEventListener("DOMContentLoaded", () => {
  creative.init();
});
```

### Features

The idea for feature integration is to encapsulate default logic from custom functionality. Another obstacle is to prevent blowing up the final creative JS filesize. We only want to integrate code which we only need in live environment. The following docs give an instruction how to integrate Features

#### Interactiv

The Interactive Feature brings the opportunity to interact with the Creative.

```JS
import Interactive from "lib/features/interactiv";
import changeColor from "./js/changeColor";
```

```JS
const creative = new Creative({
    features: {
        Interactive: new Interactive({
            type: "click",
            triggers: document.querySelectorAll(".interactive--trigger"),
            target: document.querySelector(".creative--sitebar"),
            crossFrame: true,
            action: changeColor,
        }),
    },
});

```

## Ideation

- VPAID Player
- Template Builder
- Preview
- Assets Minifier
- Auto archiving
