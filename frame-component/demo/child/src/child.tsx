import { createChild } from "../../../src/";
import { render } from "preact";
import { useEffect, useState } from "preact/hooks";

const childComponent = createChild({
  methods: ["sendMessage"],
});

function App() {
  const origionalBackgroundColor = undefined; //childComponent.properties.backgroundColor as string;
  const [backgroundColor, setBackgroundColor] = useState(
    origionalBackgroundColor || ""
  );

  useEffect(() => {
    childComponent.reportReady();
  }, []);

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
    childComponent.methods.sendMessage(messageValue);
  }

  return (
    <div id="app" style={{ backgroundColor }}>
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
}

render(<App />, document.body);
