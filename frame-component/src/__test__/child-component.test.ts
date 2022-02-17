import { ChildComponent } from "../child-component";
import { FrameBaseComponent } from "../frame-base-component";
import { emit } from "framebus";
import { CHILD_READY_EVENT } from "../internal-event-names";

jest.mock("framebus");
jest.mock("../frame-base-component");

function flushPromises() {
  return new Promise((resolve) => {
    setTimeout(resolve);
  });
}

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

  it("emits a child ready event", async () => {
    new ChildComponent({
      onCreate: jest.fn(),
    });

    await flushPromises();

    expect(emit).toBeCalledTimes(1);
    expect(emit).toBeCalledWith(undefined, CHILD_READY_EVENT);
  });

  it("allows onCreate property to be optional", () => {
    expect(() => {
      new ChildComponent({});
    }).not.toThrow();
  });

  it("passes parent props from the name to onCreate", () => {
    const onCreateSpy = jest.fn();

    window.name = '{"foo":"bar"}';

    new ChildComponent({
      onCreate: onCreateSpy,
    });

    expect(onCreateSpy).toBeCalledTimes(1);
    expect(onCreateSpy).toBeCalledWith({
      properties: { foo: "bar" },
    });
  });

  it("waits for onCreate to resolve before emitting event", async () => {
    let resolveHandler: (arg?: unknown) => void;

    const onCreateSpy = jest.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        resolveHandler = resolve;
      });
    });

    new ChildComponent({
      onCreate: onCreateSpy,
    });

    await flushPromises();

    expect(emit).not.toBeCalled();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    resolveHandler();

    await flushPromises();

    expect(emit).toBeCalledTimes(1);
  });
});
