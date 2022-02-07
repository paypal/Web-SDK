import { createParent } from "../../src";

export const parentComponent = createParent({
  url: "http://localhost:3000/child.html",
});

const app = document.querySelector<HTMLDivElement>("#app")!;

app.innerHTML = `
  <h1>Hello Frame Component</h1>
  <main id="main"></main>
`;

const main = document.querySelector<HTMLElement>("#main")!;

parentComponent.render(main);
