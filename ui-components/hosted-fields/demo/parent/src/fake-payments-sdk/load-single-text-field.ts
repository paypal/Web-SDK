import { render } from "../../../../external";

export function loadSingleTextField(container: HTMLElement) {
  render({
    textInputs: [
      {
        url: "http://localhost:3001/text.html",
        title: "IFrame Title",
        container,
      },
    ],
  });
}
