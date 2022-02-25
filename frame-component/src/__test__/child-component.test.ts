import { ChildComponent } from "../child-component";
import { FrameBaseComponent } from "../frame-base-component";
import { emit } from "framebus";
import { CHILD_READY_EVENT } from "../internal-event-names";

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

    new ChildComponent({});

    expect(FrameBaseComponent).toBeCalledTimes(1);
    expect(FrameBaseComponent).toBeCalledWith({
      channel: "unique-id",
      methods: [],
      methodNamespace: "child",
      hookNamespace: "parent",
    });

    window.location = originalLocation;
  });

  describe("reportReady()", () => {
    it("returns emit when called", () => {
      const child = new ChildComponent({});

      child.reportReady();

      expect(emit).toBeCalledTimes(1);
      expect(emit).toBeCalledWith(undefined, CHILD_READY_EVENT);
    });
  });
});
