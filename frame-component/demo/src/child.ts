import { createChild } from "../../src";

const app = document.querySelector<HTMLDivElement>("#app")!;
const sendMessageButton = document.querySelector<HTMLButtonElement>(
  "#send-message-button"
)!;
const sendMessageInput = document.querySelector<HTMLInputElement>(
  "#send-message-input"
)!;

const childComponent = createChild({
  onCreate(options) {
    // TODO define options as required so we don't have to do this null check
    if (!options) {
      return;
    }

    // TODO define options.properties as required so we don't have to do this null check
    app.style.backgroundColor = options.properties?.backgroundColor as string;
  },
  methods: ["sendMessage"],
  hooks: {
    updateBackgroundColor(color: string) {
      app.style.backgroundColor = color;
    },
  },
});

sendMessageButton.addEventListener("click", () => {
  childComponent.methods.sendMessage(sendMessageInput.value);
});
