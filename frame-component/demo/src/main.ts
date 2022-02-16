import { createParent } from "../../src";

const input = document.getElementById(
  "background-color-choice"
) as HTMLInputElement;
const button = document.getElementById(
  "background-color-submit"
) as HTMLButtonElement;
const messageContainer = document.getElementById(
  "message-from-iframe"
) as HTMLElement;

const main = document.getElementById("main") as HTMLElement;

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

parentComponent.render(main).then(() => {
  // TODO set this immediately when render resolves
  // when child reports its ready
  setTimeout(() => {
    main.classList.add("ready");
  }, 1000);
});

button.addEventListener("click", () => {
  parentComponent.methods.updateBackgroundColor(input.value);
});
