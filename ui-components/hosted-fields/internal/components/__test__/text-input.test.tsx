import { TextInput } from "../text-input";

import { render, fireEvent, screen, waitFor } from "@testing-library/preact";

describe("TextInput", () => {
  test("should render a text input", () => {
    render(<TextInput />);

    const input = screen.getByTestId("text-input");

    expect(input).toBeInstanceOf(HTMLInputElement);
  });
});
