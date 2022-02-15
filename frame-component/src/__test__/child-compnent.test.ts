import { ChildComponent } from "../child-component";
import { FrameBaseComponent } from "../frame-base-component";
import { emit } from "framebus";

jest.mock("framebus");
jest.mock("../frame-base-component");

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

    new ChildComponent({
      onCreate: jest.fn(),
    });

    expect(FrameBaseComponent).toBeCalledTimes(1);
    expect(FrameBaseComponent).toBeCalledWith({
      channel: "unique-id",
      methods: [],
      hooks: {},
    });

    window.location = originalLocation;
  });

  it("emits a child-ready event", () => {
    new ChildComponent({
      onCreate: jest.fn(),
    });

    expect(emit).toBeCalledTimes(1);
    expect(emit).toBeCalledWith(
      undefined,
      "child-ready",
      {},
      expect.any(Function)
    );
  });

  it("calls configured onCreate method with parent properties recieved from the child-ready event", () => {
    jest.mocked(emit).mockImplementation((config, eventName, data, cb) => {
      if (cb) {
        cb({
          properties: {
            parentProperty: "foo",
          },
        });
      }

      return true;
    });
    const onCreate = jest.fn();

    new ChildComponent({
      onCreate,
    });

    expect(onCreate).toBeCalledTimes(1);
    expect(onCreate).toBeCalledWith({
      properties: {
        parentProperty: "foo",
      },
    });
  });

  it("allows onCreate property to be optional", () => {
    jest.mocked(emit).mockImplementation((config, eventName, data, cb) => {
      if (cb) {
        cb({
          parentProperty: "foo",
        });
      }

      return true;
    });

    expect(() => {
      new ChildComponent({});
    }).not.toThrow();
  });
});
