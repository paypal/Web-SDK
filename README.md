# PayPal Web SDK

Welcome to PayPal's Web SDK. This library will help you accept card, PayPal, Venmo, and alternative payment methods on your website.

## Support

TODO - browser and node support

### Package Managers

This SDK supports:

- npm
- CDN

### Languages

This SDK supports Typescript (vTODO). This SDK is written in Typescript.

### Frameworks

This SDK supports:

- TODO list all supported frameworks (React, Vue, Angular, etc)

## Modularity

The PayPal iOS SDK is comprised of various submodules.

- `Card`
- `PayPal`
- ...

To accept a certain payment method in your app, you only need to include that payment-specific submodule.

## Sample Code

```
// STEP 0: Fetch an ACCESS_TOKEN and ORDER_ID from your server.

// STEP X: TODO
```

## Testing

This project uses the `jest` framework. Every code path should be unit tested. Unit tests should make up most of the test coverage, with integration/UI tests following.

### CI

GitHub Actions CI will run all tests and build commands per package manager on each PR.

## Local Development

### Dependencies

- Requires Node v16 and npm@8

Run `npm install` in the root of the directory. Since the repo is using [npm workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces), installing in the root will also install the packages in all the workspaces and create symlinks for those packages within the project. You will need to be running `npm@8` to have support for workspaces.

### Structure

This mono repo is designed so that you can clone it down and start working on the PayPal Web SDK with as little friction as possible. Currently, the repo is split into 3 workspaces:

- [sdk](./sdk/) - the module that a merchant will use to integrate with PayPal's payment processing system
- [asset-server](./asset-server/) - a development asset server that mirrors the production asset server in terms of structure. The code from `sdk` should be bundled and copied to the `dist` folder in this workspace to emulate the hosted assets in production.
- [demo](./demo/) - a demo app for testing out the sdk
- [frame-component](./frame-component/) - a component to facilitate creating iframe and popup based components (TODO, this may be changed to `ui-components` and be one of many pieces of that more general workspace)

### Start

To start the asset server and the demo app in parallel, run:

(TODO: this should also run the SDK and UI component build watch tasks)

```bash
npm run dev
```

## Release Process

This SDK follows [Semantic Versioning](https://semver.org/). The release process will be automated via GitHub Actions. (TODO)

## Analytics

TODO
