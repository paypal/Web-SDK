import { render } from "preact";
import { createChild } from "frame-component/src/create-child";

const child = createChild({
  render({ properties }) {
    return <div>{properties.text}</div>;
  },
});
const App = child.render();

render(<App />, document.getElementById("app"));
