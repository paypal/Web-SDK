import { render } from "preact";
import { TextInput } from "../../../internal/components/text-input";

function App() {
  return (
    <div>
      Foo
      <TextInput />
    </div>
  );
}

render(<App />, document.body);
