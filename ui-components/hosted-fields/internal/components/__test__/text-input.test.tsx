import { TextInput } from "../text-input";
import { fakeChild } from "../../../__mocks__/frame-component";
import { render, fireEvent, screen, waitFor } from "@testing-library/preact";

jest.mock("frame-component");

describe("TextInput", () => {
  it("should render a text input", () => {
    render(<TextInput />);

    const input = screen.getByTestId("text-input");

    expect(input).toBeInstanceOf(HTMLInputElement);
  });

  it("should mark component as ready when it first renders", () => {
    expect(fakeChild.reportReady).not.toBeCalled();

    render(<TextInput />);

    expect(fakeChild.reportReady).toBeCalledTimes(1);
  });
});
