import { createChild } from "../../src";

const app = document.querySelector<HTMLDivElement>("#app")!;
const triggerBarButton = document.querySelector<HTMLButtonElement>("#trigger-bar")!;

const childComponent = createChild({
  onCreate(options) {
    // TODO define options as required so we don't have to do this null check
    if (!options) {
      return;
    }

    // TODO define options.properties as required so we don't have to do this null check
    app.style.backgroundColor = options.properties?.backgroundColor as string;
  },
  methods: ['bar'],
  hooks: {
    setBackgroundColor(color: string) {
      console.log(color);
      app.style.backgroundColor = color;
    },
    foo(){
      console.log('This is a method called from the parent and log in the child')
    }
  }
});

triggerBarButton.addEventListener("click", () => {
  childComponent.methods.bar();
});