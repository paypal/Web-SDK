import { createChild } from "frame-component";
import { useEffect, useState } from "preact/hooks";

const child = createChild({});
type TextInputProperties = {
  value?: string;
  onInput?: (arg: string) => string;
};

const defaultOnChange = (value: string) => value;

export function TextInput(properties: TextInputProperties = {}) {
  const [value, setValue] = useState(properties.value);
  const onInputMutation = properties.onInput || defaultOnChange;

  useEffect(() => {
    child.reportReady();
  }, []);

  const onInput = (e: Event) => {
    const { value: originalValue } = e.target as HTMLInputElement;
    const newValue = onInputMutation(originalValue);

    setValue(newValue);
  };

  return (
    <>
      <input data-testid="text-input" value={value} onInput={onInput} />
    </>
  );
}
