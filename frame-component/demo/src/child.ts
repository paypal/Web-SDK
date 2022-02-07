import { createChild } from "../../src";

const app = document.querySelector<HTMLDivElement>("#app")!;

app.innerHTML = `
  <h1>Hello Frame Child Component</h1>
`;

const childComponent = createChild({});
