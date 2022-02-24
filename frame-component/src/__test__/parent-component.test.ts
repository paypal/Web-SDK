import { ParentComponent } from "../parent-component";
import { FrameBaseComponent } from "../frame-base-component";
import { once } from "framebus";
import iFramer from "@braintree/iframer";
import uuid from "@braintree/uuid";
import { CHILD_READY_EVENT } from "../internal-event-names";

jest.mock("framebus");
jest.mock("@braintree/uuid");
jest.mock("../frame-base-component");
jest.mock("@braintree/iframer");

describe("ParentComponent", () => {
  beforeEach(() => {
    jest.mocked(uuid).mockReturnValue("fake-uuid");
    jest.mocked(iFramer).mockReturnValue(document.createElement("iframe"));
  });

  it("should create channel with unique id", () => {
    new ParentComponent({
      url: "https://example.com/child-frame",
      title: "Iframe Title",
      properties: {
        foo: "bar",
      },
    });

    expect(FrameBaseComponent).toBeCalledTimes(1);
    expect(FrameBaseComponent).toBeCalledWith({
      channel: "fake-uuid",
      methods: [],
      namespace: "parent"
    });
  });

  it("creates an iframe with properties embedded in the name", async () => {
    const options = {
      url: "https://example.com/child-frame",
      title: "Iframe Title",
      properties: {
        foo: "bar",
      },
    };

    new ParentComponent(options);

    expect(iFramer).toHaveBeenCalledWith({
      name: JSON.stringify(options.properties),
      title: "Iframe Title",
      style: {
        border: "none",
        width: "100%",
        height: "100%",
        float: "left",
      },
    });
  });

  it("defaults properties in name to empty object if none are passed", async () => {
    new ParentComponent({
      url: "https://example.com/child-frame",
      title: "Iframe Title",
    });

    expect(iFramer).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "{}",
        title: "Iframe Title",
      })
    );
  });

  it("creates an iframe with optional id", async () => {
    const options = {
      url: "https://example.com/child-frame",
      id: "Custom ID",
      title: "Iframe Title",
      properties: {
        foo: "bar",
      },
    };

    new ParentComponent(options);

    expect(iFramer).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "Custom ID",
      })
    );
  });

  describe("render", () => {
    beforeEach(() => {
      jest.mocked(once).mockImplementation((config, eventName, cb) => {
        if (cb) {
          // mocking the async nature of this action
          setTimeout(() => {
            cb({}, jest.fn());
          }, 1);
        }

        return true;
      });
    });

    it("inserts the iframe element into the provided DOM node", async () => {
      const parent = new ParentComponent({
        url: "https://example.com/child-frame",
        title: "Iframe Title",
      });
      const container = document.createElement("div");

      await parent.render(container);

      const iframe = container.querySelector("iframe") as HTMLIFrameElement;
      expect(iframe.src).toContain("https://example.com/child-frame#");
    });

    it("resolves with the component instance once the child reports it is ready", async () => {
      const parent = new ParentComponent({
        url: "https://example.com/child-frame",
        title: "Iframe Title",
      });
      const container = document.createElement("div");

      const instance = await parent.render(container);

      expect(once).toBeCalledTimes(1);
      expect(once).toBeCalledWith(
        undefined,
        CHILD_READY_EVENT,
        expect.any(Function)
      );

      expect(instance).toBe(parent);
    });
  });
});
