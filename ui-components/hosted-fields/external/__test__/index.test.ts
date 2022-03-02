import { render } from "../";
import { createParent } from "frame-component";
import type { ParentComponent } from "frame-component/src/parent-component";

jest.mock("frame-component");

describe("render", () => {
  let fakeFrameComponent: ParentComponent;

  beforeEach(() => {
    fakeFrameComponent = {
      render: jest.fn().mockResolvedValue(fakeFrameComponent),
    } as unknown as ParentComponent;

    jest.mocked(createParent).mockReturnValue(fakeFrameComponent);
  });

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

    expect(fakeFrameComponent.render).toBeCalledTimes(2);
    expect(fakeFrameComponent.render).toBeCalledWith(dom1);
    expect(fakeFrameComponent.render).toBeCalledWith(dom2);
  });
});
