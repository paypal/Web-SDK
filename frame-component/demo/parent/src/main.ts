import { createParent } from "../../../";

const input = document.getElementById(
  "background-color-choice"
) as HTMLInputElement;
const submitBackgroundButton = document.getElementById(
  "background-color-submit"
) as HTMLButtonElement;
const getBackgroundButton = document.getElementById(
  "background-color-get"
) as HTMLButtonElement;
const messageContainer = document.getElementById(
  "message-from-iframe"
) as HTMLElement;

const main = document.getElementById("main") as HTMLElement;

export const parentComponent = createParent({
  url: "http://localhost:3001",
  title: "Child Iframe",
  properties: {
    backgroundColor: "lightblue",
  },
  methods: ["updateBackgroundColor", "getBackgroundColor"],
});

parentComponent.defineHook("sendMessage", (message: string) => {
  messageContainer.innerText = message;
});

parentComponent.render(main).then(() => {
  main.classList.add("ready");
});

submitBackgroundButton.addEventListener("click", () => {
  parentComponent.methods.updateBackgroundColor(input.value);
});

getBackgroundButton.addEventListener("click", () => {
  parentComponent.methods.getBackgroundColor().then((result) => {
    input.value = result as string;
  });
});
