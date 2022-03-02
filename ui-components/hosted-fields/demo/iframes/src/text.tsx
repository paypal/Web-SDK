import { render } from "preact";
import { TextInput } from "../../../internal/components/text-input";

function App() {
  const onChange = (val: string) => {
    return val.toUpperCase();
  };
  return (
    <div>
      Foo
      <TextInput onChange={onChange} />
    </div>
  );
}

render(<App />, document.body);
