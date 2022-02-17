import { createChild } from "../../../src";

const app = document.getElementById("app") as HTMLDivElement;
const colorChoice = document.getElementById("color-choice") as HTMLDivElement;
const sendMessageButton = document.getElementById(
  "send-message-button"
) as HTMLButtonElement;
const sendMessageInput = document.getElementById(
  "send-message-input"
) as HTMLInputElement;

function updateBackgroundColor(color: string) {
  app.style.backgroundColor = color;
  colorChoice.innerText = `Everything you see in this ${color} box is in an iframe.`;
}

const childComponent = createChild({
  onCreate(options) {
    updateBackgroundColor(options.properties.backgroundColor as string);
  },
  methods: ["sendMessage"],
  hooks: {
    updateBackgroundColor(color: string) {
      updateBackgroundColor(color);
    },
    getBackgroundColor() {
      return app.style.backgroundColor;
    },
  },
});

sendMessageButton.addEventListener("click", () => {
  childComponent.methods.sendMessage(sendMessageInput.value);
});
