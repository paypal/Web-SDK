# Frame Component

A module for creating a wrapper around iframes/popups for communicating with the parent page. Inspired by [zoid](https://github.com/krakenjs/zoid), but written in TypeScript without the extra reactive component.

Define a component to be put on both the parent and child pages:

```js
// create parent component
import { createParent } from "frame-component";

const parentComponent = createParent({
  url: "https://www.example.com/location-of-child-component",
  properties: {
    backgroundColor: "red",
  },
  methods: ["bar"],
  hooks: {
    onFoo(arg1, arg2, arg3) {
      console.log("onFoo was called on the child frame with args:", arg1, arg2, arg3, "and I am logging this on the parent page")
    },
  }
});

await parentComponent.render(refToADomNodeWhereTheComponentWillBeInserted);

// create child component
import { createChild } from "frame-component";

const childComponent = createChild({
  onCreate({ properties }) {
    // run any code that must be run after the component has finished setting up
    // such as applying any properties that the parent has configured
    document.querySelector('#background-element').style.backgroundColor = properties.backgroundColor;
  },
  methods: ["onFoo"],
  hooks: {
    bar(arg1, arg2, arg3) {
      console.log("bar was called on the parent frame with args:", arg1, arg2, arg3, "so I am logging this on the child");
    }
  }
});
```

The parent component can call any of the methods defined in the methods array with any number of arguments:

```js
parentComponent.bar('first', 'second', 'third');

// in the child iframe, we will see this logged to the console:
"bar was called on the parent frame with args: first second third so I am logging this on the child"
```

The child component can call any of the hooks defined.

```js
childComponent.onFoo("first", "second", "third");

// in the parent page, we will see this logged to the console
"onFoo was called on the child frame with args: first second third and I am logging this on the parent page"
```