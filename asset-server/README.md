# Development Asset Server

This workspace serves as a structural mirror to the production asset server. (TODO, include link to domain of the production asset server once it is deployed)

To launch it, [review the directions in the root of the repo](../README.md#start) or run `npm start` from this directory.

This will start a locally running asset server on port 9001.

The structure of the asset server mirrors that of the production asset server, where the root of the files are located in the `dist` directory (and ignored by git):

(TODO: the following is a proposal for the structure, make sure this stays up to date when it's actually finalized and add new directories as they become necessary)

```bash
.
└── web-sdk
    └── v1
        └── 1.0.0
            ├── html
            │   ├── hosted-fields.html
            │   └── hosted-fields.min.html
            ├── images
            │   └── some-image.png
            └── js
                ├── web-sdk.js
                └── web-sdk.min.js
```
