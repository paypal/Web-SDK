import { createChild } from "../../../src/create-child";
import { render } from "preact";
import { useState, useEffect } from "preact/hooks";

const childComponent = createChild({
  render({ properties }) {
    const origionalBackgroundColor = properties.backgroundColor as string;
    const [backgroundColor, setBackgroundColor] = useState(
      origionalBackgroundColor || ""
    );

    childComponent.defineHook("updateBackgroundColor", (color: string) => {
      setBackgroundColor(color);
    });
    childComponent.defineHook("getBackgroundColor", () => {
      return backgroundColor;
    });

    const [messageValue, setMessageValue] = useState("");
    const onInput = (e: Event) => {
      const value = (e.target as HTMLInputElement).value;
      setMessageValue(value);
    };

    function sendMessage() {
      console.log("sending message:", messageValue);
      childComponent.methods.sendessage(messageValue);
    }

    return (
      <div className="container" style={{ backgroundColor }}>
        <div className="section">
          <h1>Frame Child Component</h1>
        </div>

        <p className="section" id="color-choice" aria-live="true">
          Everything you see in this {backgroundColor} box is in an iframe.
        </p>

        <div className="section">
          <input
            id="send-message-input"
            type="text"
            placeholder="message here"
            value={messageValue}
            onInput={onInput}
          />
          <button id="send-message-button" onClick={sendMessage}>
            Send Message
          </button>
        </div>
      </div>
    );
  },
  methods: ["sendMessage"],
});

const App = childComponent.render();

render(<App />, document.getElementById("app") as HTMLDivElement);
