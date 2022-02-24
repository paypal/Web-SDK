/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FrameBaseComponent } from "../frame-base-component";
import { on, off, emitAsPromise, initialize, FramebusConfig } from "framebus";

jest.mock("framebus");

describe("FrameBaseComponent", () => {
  let fakeConfig: FramebusConfig;

  class SubComponent extends FrameBaseComponent {}

  beforeEach(() => {
    fakeConfig = {} as FramebusConfig;
    jest.mocked(initialize).mockReturnValue(fakeConfig);
    jest.mocked(emitAsPromise).mockResolvedValue({});
  });

  it("should create a bus config with provided channel", () => {
    new SubComponent({
      channel: "custom-channel",
      methods: [],
      namespace: "subcomponent"
    });

    expect(initialize).toBeCalledTimes(1);
    expect(initialize).toBeCalledWith({
      channel: "custom-channel",
    });
  });

  it("creates methods for each method name that is passed", () => {
    const component = new SubComponent({
      channel: "custom-channel",
      methods: ["foo", "bar"],
      namespace: "subcomponent"
    });

    expect(component.methods.foo).toEqual(expect.any(Function));
    expect(component.methods.bar).toEqual(expect.any(Function));
    expect(component.methods.notImplemented).toBeFalsy();

    component.methods.foo("foo", "bar", "baz");

    expect(emitAsPromise).toBeCalledTimes(1);
    expect(emitAsPromise).toBeCalledWith(fakeConfig, "trigger-method-foo", {
      args: ["foo", "bar", "baz"],
    });

    jest.mocked(emitAsPromise).mockClear();

    component.methods.bar("foo", "bar", "baz");

    expect(emitAsPromise).toBeCalledTimes(1);
    expect(emitAsPromise).toBeCalledWith(fakeConfig, "trigger-method-bar", {
      args: ["foo", "bar", "baz"],
    });
  });

  it("creates methods that resolve when the emit call resolves", async () => {
    const component = new SubComponent({
      channel: "custom-channel",
      methods: ["foo"],
      namespace: "subcomponent"
    });

    jest.mocked(emitAsPromise).mockResolvedValue({ result: "foo" });

    const result = await component.methods.foo("foo");

    expect(result).toEqual("foo");
  });

  it("creates methods that reject with errors when the emit call resolves with an error string message", async () => {
    const component = new SubComponent({
      channel: "custom-channel",
      methods: ["foo"],
      namespace: "subcomponent"
    });

    jest
      .mocked(emitAsPromise)
      .mockResolvedValue({ error: "some error message" });

    await expect(component.methods.foo("foo")).rejects.toEqual(
      new Error("some error message")
    );
  });

  it("creates methods that reject with objects when the emit call resolves with an error value other than string", async () => {
    const component = new SubComponent({
      channel: "custom-channel",
      methods: ["foo"],
      namespace: "subcomponent"
    });

    jest
      .mocked(emitAsPromise)
      .mockResolvedValue({ error: { message: "some error message" } });

    await expect(component.methods.foo("foo")).rejects.toEqual({
      message: "some error message",
    });
  });

  it("namespaces the methods based on input", () => {
    const fooSpy = jest.fn()
    const namespace = "subcomponent"
    const methodName = "foo"
    const component = new SubComponent({
      channel: "muh-channel",
      methods: [methodName],
      namespace: "subcomponent"
    })

    component.defineHook(methodName, fooSpy)

    expect(on).toBeCalledWith(
      fakeConfig,
      `trigger-${namespace}-method-${methodName}`,
      expect.any(Function)
    );
  })

  it("creates listener for each hook", () => {
    const fooSpy = jest.fn();
    const barSpy = jest.fn();
    const namespace = "subcomponent"

    const component = new SubComponent({
      channel: "custom-channel",
      methods: [],
      namespace
    });

    component.defineHook("foo", fooSpy);
    component.defineHook("bar", barSpy);

    const fooEventName = `trigger-${namespace}-method-foo`
    const barEventName = `trigger-${namespace}-method-bar`

    expect(on).toBeCalledTimes(2);
    expect(on).toBeCalledWith(
      fakeConfig,
      fooEventName,
      expect.any(Function)
    );
    expect(on).toBeCalledWith(
      fakeConfig,
      barEventName,
      expect.any(Function)
    );

    const fooCallback = jest.mocked(on).mock.calls.find((args) => {
      return args[1] === fooEventName;
    })![2];

    fooCallback(
      {
        args: ["foo", "bar", "baz"],
      },
      jest.fn()
    );

    expect(fooSpy).toBeCalledTimes(1);
    expect(fooSpy).toBeCalledWith("foo", "bar", "baz");

    const barCallback = jest.mocked(on).mock.calls.find((args) => {
      return args[1] === barEventName;
    })![2];

    barCallback(
      {
        args: ["foo", "bar", "baz"],
      },
      jest.fn()
    );

    expect(barSpy).toBeCalledTimes(1);
    expect(barSpy).toBeCalledWith("foo", "bar", "baz");
  });

  it("removes the listener if it already exists", () => {
    const fooSpy = jest.fn();
    const namespace = "subcomponent";
    const component = new SubComponent({
      channel: "custom-channel",
      methods: [],
      namespace
    });

    component.defineHook("foo", fooSpy);
    component.defineHook("foo", fooSpy);

    expect(on).toBeCalledTimes(2);
    expect(off).toBeCalledTimes(1);
    expect(off).toBeCalledWith(
      fakeConfig,
      `trigger-${namespace}-method-foo`,
      expect.any(Function)
    );
  });

  it("replies with a result object with whatever the hook resolves with", async () => {
    const fooSpy = jest.fn().mockResolvedValue("foo");
    const barSpy = jest.fn().mockReturnValue("bar");

    const namespace = "subcomponent"
    const component = new SubComponent({
      channel: "custom-channel",
      methods: [],
      namespace
    });

    component.defineHook("foo", fooSpy);
    component.defineHook("bar", barSpy);

    const fooEventName = `trigger-${namespace}-method-foo`
    const barEventName = `trigger-${namespace}-method-bar`

    const fooCallback = jest.mocked(on).mock.calls.find((args) => {
      return args[1] === fooEventName;
    })![2];

    const fooReply = jest.fn();

    await fooCallback(
      {
        args: ["foo", "bar", "baz"],
      },
      fooReply
    );

    expect(fooReply).toBeCalledTimes(1);
    expect(fooReply).toBeCalledWith({
      result: "foo",
    });

    const barCallback = jest.mocked(on).mock.calls.find((args) => {
      return args[1] === barEventName;
    })![2];
    const barReply = jest.fn();

    await barCallback(
      {
        args: ["foo", "bar", "baz"],
      },
      barReply
    );

    expect(barReply).toBeCalledTimes(1);
    expect(barReply).toBeCalledWith({
      result: "bar",
    });
  });

  it("replies with an error message when hook throws an error or rejects with an error", async () => {
    const fooSpy = jest.fn().mockRejectedValue(new Error("some error"));
    const barSpy = jest.fn().mockImplementation(() => {
      throw new Error("some other error");
    });

    const namespace = "subcomponent"
    const component = new SubComponent({
      channel: "custom-channel",
      methods: [],
      namespace
    });

    component.defineHook("foo", fooSpy);
    component.defineHook("bar", barSpy);

    const fooCallback = jest.mocked(on).mock.calls.find((args) => {
      return args[1] === `trigger-${namespace}-method-foo`;
    })![2];

    const fooReply = jest.fn();

    await fooCallback(
      {
        args: ["foo", "bar", "baz"],
      },
      fooReply
    );

    expect(fooReply).toBeCalledTimes(1);
    expect(fooReply).toBeCalledWith({
      error: "some error",
    });

    const barCallback = jest.mocked(on).mock.calls.find((args) => {
      return args[1] === `trigger-${namespace}-method-bar`;
    })![2];
    const barReply = jest.fn();

    await barCallback(
      {
        args: ["foo", "bar", "baz"],
      },
      barReply
    );

    expect(barReply).toBeCalledTimes(1);
    expect(barReply).toBeCalledWith({
      error: "some other error",
    });
  });

  it("replies with an error message when hook throws something that is not an error", async () => {
    const fooSpy = jest.fn().mockRejectedValue({
      message: "not some error",
    });
    const barSpy = jest.fn().mockImplementation(() => {
      throw { message: "not some other error" };
    });
    const namespace = "subcomponent"
    const component = new SubComponent({
      channel: "custom-channel",
      methods: [],
      namespace
    });

    component.defineHook("foo", fooSpy);
    component.defineHook("bar", barSpy);

    const fooCallback = jest.mocked(on).mock.calls.find((args) => {
      return args[1] === `trigger-${namespace}-method-foo`;
    })![2];

    const fooReply = jest.fn();

    await fooCallback(
      {
        args: ["foo", "bar", "baz"],
      },
      fooReply
    );

    expect(fooReply).toBeCalledTimes(1);
    expect(fooReply).toBeCalledWith({
      error: { message: "not some error" },
    });

    const barCallback = jest.mocked(on).mock.calls.find((args) => {
      return args[1] === `trigger-${namespace}-method-bar`;
    })![2];
    const barReply = jest.fn();

    await barCallback(
      {
        args: ["foo", "bar", "baz"],
      },
      barReply
    );

    expect(barReply).toBeCalledTimes(1);
    expect(barReply).toBeCalledWith({
      error: { message: "not some other error" },
    });
  });

  it("throws an error when multiple methods with the same name are passed", () => {
    expect(() => {
      new SubComponent({
        channel: "custom-channel",
        methods: ["foo", "foo"],
        namespace: "subcomponent"
      });
    }).toThrow(
      new Error(
        "Implementation Error: multiple instances of method 'foo' detected"
      )
    );
  });
});
