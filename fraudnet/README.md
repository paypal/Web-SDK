# Fraudnet

Loads Fraudnet on the page

## Usage

Adding the Fraudnet and Congfig scripts on the page

```ts
import { createFraudnet } from "Fraudnet";

const fraudnetOptions = {
  env: "sand",
  clientMetadataId: "cmid123",
  cspNonce: "cspNonce1",
  timeout: "5s",
  sessionId: "id123",
};

const Fraudnet = createFraudnet(fraudnetOptions);

// Adds a Fraudnet and Config script on the document.body
Fraudnet.loadScript();
// Do something with Fraudnet
// Then remove it from the page
Fraudnet.removeScript();
```
