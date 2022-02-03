# Frame Component

A module for creating a wrapper around iframes/popups for communicating with the parent page. Inspired by [zoid](https://github.com/krakenjs/zoid), but written in TypeScript without the extra reactive component.

Define a component to be put on both the parent and child pages:

```js
// step 1, define the component
import { create } from "frame-component";

const MyIframeBasedComponent = create({
  properties: ["backgroundColor"],
  hooks: ["onFoo"],
  methods: {
    bar() {
      console.log("this will log in the child frame.");
    },
  },
});

export const MyIframeParent = MyIframeBasedComponent.parent;
export const MyIframeChild = MyIframeBasedComponent.child;
```

Next, we need to

```js
// step 2, render the component on the parent page
const component = new MyIframeParent({
  url: "https://www.example.com/location-of-child-component",
  properties: {
    backgroundColor: "red",
  },

  onFoo() {
    // when onFoo is called on the parent, do this on the child
  },
});

await component.render(refToADomNodeWhereTheComponentWillBeInserted);

// step 3, create child component in iframe
const childComponent = new MyIframeChild({
  onCreate({ methods }) {
    // set background color of component to red

    // methods.bar();
    methods.onFoo();
  },
});
```
