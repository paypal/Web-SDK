import { createParent } from "../../src";

export const parentComponent = createParent({
  url: "http://localhost:3000/child.html",
  properties: {
    backgroundColor: "red"
  },
  methods: ['setBackgroundColor', 'foo'],
  hooks: {
    bar(){
      console.log('This is a method called from the child and log in the parent')
    }
  }
});

const app = document.querySelector<HTMLDivElement>("#app")!;
const input = document.querySelector<HTMLInputElement>("#background-color-choice")!;
const button = document.querySelector<HTMLButtonElement>("#background-color-submit")!;

const main = document.querySelector<HTMLElement>("#main")!;

parentComponent.render(main);

button.addEventListener("click", () => {
  parentComponent.methods.setBackgroundColor(input.value);
})
