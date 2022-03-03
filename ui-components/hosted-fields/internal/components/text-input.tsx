import { useState } from "preact/hooks";

type TextInputProperties = {
  value?: string;
  onInput?: (arg: string) => string;
};

const defaultOnChange = (value: string) => value;

export function TextInput(properties: TextInputProperties = {}) {
  const [value, setValue] = useState(properties.value);
  const onInputMutation = properties.onInput || defaultOnChange;

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
