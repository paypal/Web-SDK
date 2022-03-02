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

  it("can set the default value on the input", async () => {
    render(<TextInput value="value" />);

    const input = screen.getByTestId("text-input") as HTMLInputElement;

    expect(input.value).toBe("value");
  });

  it("should provide a hook for mutating the value on change", async () => {
    const spy = jest.fn().mockImplementation((str: string) => {
      return str.toUpperCase();
    });

    render(<TextInput onInput={spy} />);

    const input = screen.getByTestId("text-input") as HTMLInputElement;

    expect(spy).not.toBeCalled();

    fireEvent.input(input, { target: { value: "foo" } });

    await waitFor(() => {
      expect(input.value).toBe("FOO");
    });

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith("foo");
  });

  it("makes no changes to the value when no onChange function is passed", async () => {
    render(<TextInput />);

    const input = screen.getByTestId("text-input") as HTMLInputElement;

    fireEvent.input(input, { target: { value: "foo" } });

    await waitFor(() => {
      expect(input.value).toBe("foo");
    });
  });
});
