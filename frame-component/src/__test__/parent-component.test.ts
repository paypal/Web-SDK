import { ParentComponent } from "../parent-component";
import { on, initialize, FramebusConfig } from "framebus";
import uuid from "@braintree/uuid";

jest.mock("framebus");

describe("ParentComponent", () => {
  beforeEach(() => {
    jest.mocked(initialize).mockImplementation((options = {}) => {
      return {
        channel: options.channel
      } as FramebusConfig;
    });
  })

  it("should reply with the props to the child with the handshake is received", () => {
    const spy = jest.fn();

    jest.mocked(on).mockImplementation((config, eventName, cb) => {
      if (cb) {
        cb({}, spy);
      }

      return true;
    });

    const parent = new ParentComponent({
      url: "https://example.com/child-frame",
      channel: "channel",
      properties: {
        foo: "bar"
      }
    });

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({
      properties: {
        foo: "bar"
      }
    });
  });

  describe("render", () => {

    const channel = uuid();

    it("inserts the iframe element into the provided DOM node", async () => {
      const parent = new ParentComponent({ url: "https://example.com/child-frame", channel });
      const container = document.createElement("div");

      await parent.render(container);

      const iframe = container.querySelector("iframe");
      expect(iframe?.src).toBe(`https://example.com/child-frame#${channel}`);
    });

    it("resolves with the component instance", async () => {
      const parent = new ParentComponent();
      const container = document.createElement("div");

      const instance = await parent.render(container);

      expect(instance).toBe(parent);
    });

  });
});
