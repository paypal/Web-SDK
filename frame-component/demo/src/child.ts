import { createChild } from "../../src";

const app = document.getElementById("app") as HTMLDivElement;
const sendMessageButton = document.getElementById(
  "send-message-button"
) as HTMLButtonElement;
const sendMessageInput = document.getElementById(
  "send-message-input"
) as HTMLInputElement;

const childComponent = createChild({
  onCreate(options) {
    app.style.backgroundColor = options.properties.backgroundColor as string;
  },
  methods: ["sendMessage"],
  hooks: {
    updateBackgroundColor(color: string) {
      app.style.backgroundColor = color;
    },
    getBackgroundColor() {
      return app.style.backgroundColor;
    },
  },
});

sendMessageButton.addEventListener("click", () => {
  childComponent.methods.sendMessage(sendMessageInput.value);
});
