import { render } from "preact";
import { TextInput } from "../../../internal/components/text-input";

function App() {
  const onInput = (val: string) => {
    return val.toUpperCase();
  };
  return (
    <div>
      Foo
      <TextInput onInput={onInput} />
    </div>
  );
}

render(<App />, document.body);
