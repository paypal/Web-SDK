import { createParent } from "../../src";

const input = document.querySelector<HTMLInputElement>(
  "#background-color-choice"
)!;
const button = document.querySelector<HTMLButtonElement>(
  "#background-color-submit"
)!;
const messageContainer = document.querySelector<HTMLElement>(
  "#message-from-iframe"
)!;

const main = document.querySelector<HTMLElement>("#main")!;

export const parentComponent = createParent({
  url: "http://localhost:3000/child.html",
  properties: {
    backgroundColor: "red",
  },
  methods: ["updateBackgroundColor"],
  hooks: {
    sendMessage(message: string) {
      messageContainer.innerText = message;
    },
  },
});

parentComponent.render(main);

button.addEventListener("click", () => {
  parentComponent.methods.updateBackgroundColor(input.value);
});
