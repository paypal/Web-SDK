# Development Asset Server

This workspace serves as a structural mirror to the production asset server.

To launch it, simply run:

```bash
npm start
```

or, from the root directory:

```bash
npm start --workspace=asset-server
```

This will start a locally running asset server on port 9001.

The structure of the asset server mirrors that of the production asset server:

(TODO: the following is a proposal structure, make sure this stays up to date when it's actually finalized)

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