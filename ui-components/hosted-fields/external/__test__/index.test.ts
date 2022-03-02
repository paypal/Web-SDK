import { render } from "../";
import { createParent } from "frame-component";
import { fakeParent } from "../../__mocks__/frame-component";

jest.mock("frame-component");

describe("render", () => {
  it("renders frame component in the specified container", () => {
    const dom1 = document.createElement("div");
    const dom2 = document.createElement("div");
    dom1.id = "one";
    dom2.id = "two";

    render({
      textInputs: [
        {
          url: "https://example.com/first-iframe",
          title: "Title One",
          container: dom1,
        },
        {
          url: "https://example.com/second-iframe",
          title: "Title Two",
          container: dom2,
        },
      ],
    });

    expect(createParent).toBeCalledTimes(2);
    expect(createParent).toBeCalledWith({
      url: "https://example.com/first-iframe",
      title: "Title One",
    });
    expect(createParent).toBeCalledWith({
      url: "https://example.com/second-iframe",
      title: "Title Two",
    });

    expect(fakeParent.render).toBeCalledTimes(2);
    expect(fakeParent.render).toBeCalledWith(dom1);
    expect(fakeParent.render).toBeCalledWith(dom2);
  });
});
