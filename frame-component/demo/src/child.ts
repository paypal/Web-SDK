import { createChild } from "../../src";

const app = document.querySelector<HTMLDivElement>("#app")!;

app.innerHTML = `
  <h1>Hello Frame Child Component</h1>
`;

const childComponent = createChild({
  onCreate(options) {
    // TODO define options as required so we don't have to do this null check
    if (!options) {
      return;
    }

    // TODO define options.properties as required so we don't have to do this null check
    app.style.backgroundColor = options.properties?.backgroundColor as string;
  }
});
