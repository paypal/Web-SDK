import { ChildComponent } from "../child-component";
import { FrameBaseComponent } from "../frame-base-component";
import { emit } from "framebus";
import { CHILD_READY_EVENT } from "../internal-event-names";
import { useEffect } from "preact/hooks";

jest.mock("framebus");
jest.mock("../frame-base-component");
jest.mock("preact/hooks");

describe("ChildComponent", () => {
  it("initializes with a channel from the url hash", () => {
    const originalLocation = window.location;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete window.location;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.location = {
      hash: "#unique-id",
    };

    new ChildComponent({ render: jest.fn() });

    expect(FrameBaseComponent).toBeCalledTimes(1);
    expect(FrameBaseComponent).toBeCalledWith({
      channel: "unique-id",
      methods: [],
    });

    window.location = originalLocation;
  });

  describe("render", () => {
    it("returns a render function that calls the render callback", () => {
      const renderSpy = jest.fn();
      const child = new ChildComponent({ render: renderSpy });

      const renderCallback = child.render();

      expect(renderSpy).not.toBeCalled();

      renderCallback();

      expect(renderSpy).toBeCalledTimes(1);
    });

    it("calls render hook with parent properties", () => {
      window.name = '{"foo":"bar"}';

      const renderSpy = jest.fn();
      const child = new ChildComponent({ render: renderSpy });

      child.render()();

      expect(renderSpy).toBeCalledTimes(1);
      expect(renderSpy).toBeCalledWith({
        properties: {
          foo: "bar",
        },
      });
    });

    it("emits a child ready event when use effect fires (indicating it has rendered for the first time)", async () => {
      const child = new ChildComponent({ render: jest.fn() });

      const renderCallback = child.render();

      renderCallback();

      expect(emit).not.toBeCalled();

      const useEffectCb = jest.mocked(useEffect).mock.calls[0][0];

      useEffectCb();

      expect(emit).toBeCalledTimes(1);
      expect(emit).toBeCalledWith(undefined, CHILD_READY_EVENT);
    });
  });
});
