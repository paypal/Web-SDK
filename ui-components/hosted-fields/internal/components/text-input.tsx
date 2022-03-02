import { createChild } from "frame-component";
import { useEffect } from "preact/hooks";

const child = createChild({});

export function TextInput() {
  useEffect(() => {
    child.reportReady();
  }, []);

  return (
    <>
      <input data-testid="text-input" />
    </>
  );
}
