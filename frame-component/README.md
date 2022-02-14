# Frame Component

A module for creating a wrapper around iframes/popups for communicating with the parent page. Inspired by [zoid](https://github.com/krakenjs/zoid), but written in TypeScript without the extra reactive component.

## Basic Example

First, create an HTML page where your component will be rendered.

```html
<div id="container"></div>
```

Next, create the parent component and render it.

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
  .render(document.getElementById<HTMLDivElement>("container")!)
  .then((instance) => {
    // instance === parentComponent
    console.log("done rendering");
  });
```

On your iframe page, create the HTML needed for your component:

```html
<div id="background-element">
  <!-- important UI stuff -->
</div>
```

And finally, create the child component.

```ts
import { createChild } from "frame-component";

const backgroundElement =
  document.getElementById<HTMLDivElement>("background-element")!;

const childComponent = createChild({
  onCreate({ properties }) {
    // run any code that must be run after the component has finished setting up
    // such as applying any properties that the parent has configured
    backgroundElement.style.backgroundColor = properties.backgroundColor;
  },
});
```

## Example with Hooks and Methods

Your components can also have methods/hooks to faciliate interaction between the parent and the child. The methods are configured by passing an array of strings with the method names, these names correspond with the hooks defined on the corrolary component. For instance, a method with configured name `foo` on the parent will trigger the child's hook `foo` when the method `foo` is called on the parent. The same is true in reverse. Any methods defined on the child, when called, will trigger a hook with the corresponding name on the parent. Any arguments passed to the method will be passed to the corresponding hook.

Update the HTML to have an input and button where the user can set the color of the background:

```html
<div id="container"></div>
<div id="message-from-iframe"></div>
<input
  id="background-color-choice"
  type="text"
  placeholder="background color"
/>
<button id="background-color-button">Update Background Color</button>
```

Define a `updateBackgroundColor` method that can be called on the parent component and a `sendMessage` hook that will trigger when the `sendMessage` method is called on the child.

```ts
import { createParent } from "frame-component";

const messageFromIframeContainer = document.getElementById<HTMLDivElement>(
  "message-from-iframe"
)!;
const button = document.getElementById<HTMLDivElement>(
  "background-color-button"
)!;
const container = document.getElementById<HTMLDivElement>("container")!;

const parentComponent = createParent({
  url: "https://www.example.com/location-of-child-component",
  properties: {
    backgroundColor: "red",
  },
  methods: ["updateBackgroundColor"],
  hooks: {
    sendMessage(message: string) {
      messageFromIframeContainer.innerText = message;
    },
  },
});

parentComponent.render(container);

button.addEventListener("click", () => {
  const newColor = document.getElementById<HTMLInputElement>(
    "background-color-choice"
  )!.value;

  parentComponent.updateBackgroundColor(newColor);
});
```

Update the HTML to have an element the user can interact with.

```html
<div id="background-element">
  <input id="message" type="text" placeholder="Message text" disabled />
  <button id="button" disabled>Send Message to Parent</button>
</div>
```

Define a `updateBackgroundColor` hook that corresponds with the method on the parent. This will be invoked whenever the parent calls `updateBackgroundColor`. Define the prescence of the `onColorNameUpdate` method.

```ts
import { createChild } from "frame-component";

const backgroundElement =
  document.getElementById<HTMLDivElement>("background-element")!;
const messageInput =
  document.getElementById<HTMLInputElement>("background-element")!;
const messageButton =
  document.getElementById<HTMLButtonElement>("background-element")!;

const childComponent = createChild({
  onCreate({ properties }) {
    backgroundElement.style.backgroundColor = properties.backgroundColor;
    messageInput.removeAttributed("disabled");
    messageButton.removeAttributed("disabled");
  },
  methods: ["sendMessage"],
  hooks: {
    updateBackgroundColor(color) {
      backgroundElement.style.backgroundColor = color;
    },
  },
});

messageButton.addEventListener("click", () => {
  childComponent.sendMessage(messageInput.value);
});
```
