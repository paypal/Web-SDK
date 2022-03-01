# Frame Component

A module for creating a wrapper around iframes/popups (popup feature is aspirational right now) for communicating with the parent page. Inspired by [zoid](https://github.com/krakenjs/zoid), but written in TypeScript without the extra reactive component.

## Basic Iframe Example

First, create an HTML page where your component will be rendered.

```html
<div id="container"></div>
```

Next, create the parent component and render it. This will insert an iframe into the page with the `src` of the `url` you used to configure the parent. Render will resolve when the child component has fully set up and resolves with the instance of the parent component.

```ts
// create parent component on the parent page
import { createParent } from "frame-component";

const parentComponent = createParent({
  url: "https://www.example.com/location-of-child-component",
  properties: {
    backgroundColor: "red",
  },
});

parentComponent
  .render(document.getElementById("container") as HTMLDivElement)
  .then((instance) => {
    // instance === parentComponent
    console.log("done rendering");
  });

// here's an example of how you could chain it all together in
// an async function
const parentComponent = await createParent({
  url: "https://www.example.com/location-of-child-component",
  properties: {
    backgroundColor: "red",
  },
}).render(document.getElementById("container") as HTMLDivElement);
```

On your iframe page, create an html file that Preact will render into.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Page Title Here</title>
  </head>
  <body>
    <script type="module" src="./path/to/child.tsx"></script>
  </body>
</html>
```

And finally, create the child component.

```tsx
import { createChild } from "frame-component";
import { render } from "preact";

const childComponent = createChild({
  render({ properties }) {
    const backgroundColor = properties.backgroundColor as string;

    return (
      <div style={{ backgroundColor }}>
        <div class="section">
          <h1>Frame Child Component</h1>
        </div>

        <p class="section" aria-live="true">
          Everything you see in this {backgroundColor} box is in an iframe.
        </p>
      </div>
    );
  },
});

const App = childComponent.render();

render(<App />, document.body);
```

## Example with Hooks and Methods

Your components can also have methods/hooks to faciliate interaction between the parent and the child. The methods are configured by passing an array of strings with the method names, these names correspond with the hooks defined on the corrolary component. For instance, a method with configured name `foo` on the parent will trigger the child's hook `foo` when the method `foo` is called on the parent. The same is true in reverse. Any methods defined on the child, when called, will trigger a hook with the corresponding name on the parent. Any arguments passed to the method will be passed to the corresponding hook.

A component cannot have the same name for a method and a hook.

The method will resolve with the value that the corresponding hook returns or resolves or reject with an Error object with the message from the hook throwing an error or rejecting with an error.

To prepare the page to use methods/hooks, update the HTML on the parent page to have an input and button where the user can set the color of the background:

```html
<div id="container"></div>
<div id="message-from-iframe"></div>
<input
  id="background-color-choice"
  type="text"
  placeholder="background color"
/>
<button id="background-color-submit">Update Background Color</button>
<button id="background-color-get">Get Current Background Color</button>
```

Define a `updateBackgroundColor` method that can be called on the parent component and a `sendMessage` hook that will trigger when the `sendMessage` method is called on the child.

```ts
import { createParent } from "frame-component";

const messageFromIframeContainer = document.getElementById(
  "message-from-iframe"
) as HTMLDivElement;
const submitButton = document.getElementById(
  "background-color-submit"
) as HTMLButtonElement;
const getButton = document.getElementById(
  "background-color-get"
) as HTMLButtonElement;
const container = document.getElementById("container") as HTMLDivElement;

const parentComponent = createParent({
  url: "https://www.example.com/location-of-child-component",
  properties: {
    backgroundColor: "red",
  },
  methods: ["updateBackgroundColor", "getBackgroundColor"],
});

parentComponent.defineHook("sendMessage", (message: string) => {
  messageFromIframeContainer.innerText = message;
});

parentComponent.render(container);

submitButton.addEventListener("click", () => {
  const newColor = (
    document.getElementById("background-color-choice") as HTMLInputElement
  ).value;

  parentComponent.methods.updateBackgroundColor(newColor);
});

getButton.addEventListener("click", () => {
  parentComponent.methods.getBackgroundColor().then((color) => {
    console.log("Background color is currently", color);
  });
});
```

Define a `updateBackgroundColor` and a `getBackgroundColor` hook that corresponds with the methods on the parent. They will be invoked whenever the parent calls the corresponding methods. Define the prescence of the `sendMessage` method.

```tsx
import { createChild } from "frame-component";
import { render } from "preact";
import { useEffect, useState } from "preact/hooks";

const childComponent = createChild({
  methods: ["sendMessage"],
});

function App() {
  const origionalBackgroundColor = undefined; //childComponent.properties.backgroundColor as string;
  const [backgroundColor, setBackgroundColor] = useState(
    origionalBackgroundColor || ""
  );

  useEffect(() => {
    childComponent.reportReady();
  }, []);

  childComponent.defineHook("updateBackgroundColor", (color: string) => {
    setBackgroundColor(color);
  });
  childComponent.defineHook("getBackgroundColor", () => {
    return backgroundColor;
  });

  const [messageValue, setMessageValue] = useState("");
  const onInput = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    setMessageValue(value);
  };

  function sendMessage() {
    childComponent.methods.sendMessage(messageValue);
  }

  return (
    <div id="app" style={{ backgroundColor }}>
      <div className="section">
        <h1>Frame Child Component</h1>
      </div>

      <p className="section" id="color-choice" aria-live="true">
        Everything you see in this {backgroundColor} box is in an iframe.
      </p>

      <div className="section">
        <input
          id="send-message-input"
          type="text"
          placeholder="message here"
          value={messageValue}
          onInput={onInput}
        />
        <button id="send-message-button" onClick={sendMessage}>
          Send Message
        </button>
      </div>
    </div>
  );
}

render(<App />, document.body);
```

Now when the parent calls `updateBackgroundColor` with a value, the child will update the backgroundColor of the element to the provided color. When the parent calls `getBackgroundColor`, it will resolve with the return value of the `getBackgroundColor` hook on the child.

When the child calls, `sendMessage`, it will trigger the `sendMessage` hook on the parent.

## How does it all work?

This is essentially an abstraction around the [post message API](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage), (though this component uses [framebus](https://github.com/braintree/framebus), which is itself an abstraction around the post message API). When either component calls a method they have defined, it's actually sending a post message event to the corresponding component with the arguments from that method as a JSON string.

For instance, this:

```ts
parentComponent.methods.updateBackgroundColor("red");
```

Is actually doing:

```ts
// where packMessage does some things to serialize the payload,
// and target specifically the frame we are communicating with
const message = packMessage({ args: ["red"] });
window.postMessage(message, "*");
```

And the hook defintion for `updateBackgroundColor`:

```ts
childComponent.defineHook("updateBackgroundColor", (color: string) => {
  setBackgroundColor(color);
});
```

Is really doing something like:

```ts
window.addEventListener(
  "message",
  (event) => {
    // where unpackMessage deserializes the data passed in the post
    // message and checks that it was meant specifically for this iframe
    const { hookName, args } = unpackMessage(event.data);

    if (this.hooks[hookName]) {
      this.hooks[hookName](...args);
    }
  },
  false
);
```

Admittedly, it's a little more complicated than that, but these examples should serve to give you a basic idea of _how_ it works.

## Caveats

### XSS Vulnerability

Since we're using Preact to do the rendering of the UI in the child component, we have some protection against XSS attacks built in, but if you're doing any DOM manipulation yourself in the iframe while relying on properties from the parent, be careful how you use the values. For instance, a hook like this:

```ts
childComponent.defineHook("updateColor", (color: string) => {
  someDomNode.innerHTML = `
<div class="bg-${color}">
  <!-- other UI stuff -->
</div>
`;
});
```

Would open you up to JavaScript being executed on the page like:

```ts
parentComponent.updateColor(
  `red"><script>alert(window.location.href)</script><div class="foo`
);
```

### Parent Container

The iframe will fit to the height and width of the parent container, so make sure these are set in some way.

### Recomended Styles for Child

TODO, since we're using Preact now, we can set these default styles by ourselves. For best results, include these styles on your child page:

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body,
html {
  height: 100%;
  background-color: transparent;
}
```

This will ensure that your iframe fits the container on the parent page.

## Run the Demo App

From the root the repo, run the following command:

```bash
npm run demo --workspace=frame-component
```

This will create 2 [vite](https://vitejs.dev/) apps, the parent page running on http://localhost:3000 and the child iframe running on http://localhost:3001.

## Running Tests

From the root of the repo, run the following for unit tests:

```bash
npm t --workspace=frame-component
```

From the root of the repo, run the following for e2e tests (the test app must be running for the tests to start):

```bash
npm run --workspace=frame-component wdio
```
