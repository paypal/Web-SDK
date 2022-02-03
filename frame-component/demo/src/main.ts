import { Parent } from "./sample-component";

const app = document.querySelector<HTMLDivElement>("#app")!;

app.innerHTML = `
  <h1>Hello Frame Component</h1>
  <main id="main"></main>
`;

const main = document.querySelector<HTMLElement>("#main")!;

const parent = new Parent();
parent.render(main);
