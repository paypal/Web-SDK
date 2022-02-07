# Frame Component

A module for creating a wrapper around iframes/popups for communicating with the parent page. Inspired by [zoid](https://github.com/krakenjs/zoid), but written in TypeScript without the extra reactive component.

Define a component to be put on both the parent and child pages:

```js
const MyIframeBasedComponent = frameComponent.create({
    url: 'http://www.my-site.com/my-login-component',
    properties: {
        foo: {
            kind: "string",
            required: false
        }
    },
    hooks: ["onFoo"],
    methods: {
        bar() {
            console.log('this will log in the child frame.');
        }
    }
});

export MyIframeBasedComponent;
```

Render the component on the parent page:

```js
import { MyIframeBasedComponent } from "./path/to/component";

const component = await MyIframeBasedComponent({
  properties: {
    foo: "bar",
  },
  hooks: {
    onFoo: function (data) {
      console.log("found some data", data);
    },
  },
}).render(document.getElementById("#container"));

component.bar(); // will trigger the bar function to run in the child frame
```

Implement the component in the iframe:

```js
import { MyIframeBasedComponent } from "./path/to/component";

MyIframeBasedComponent.props.foo; // "bar"

// triggers the onFoo hook on the parent page with the arg { foo: "bar" }
MyIframeBasedComponent.hooks.onFoo({ foo: "bar" });
```
