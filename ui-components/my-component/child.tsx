import { render } from "preact";
import { createChild } from "frame-component/src/create-child";

const App = createChild({
  render({ properties }) {
    return <div>{properties.text}</div>;
  },
});

render(<App />, document.getElementById("app"));
