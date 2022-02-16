import { ParentComponent } from "../parent-component";
import { FrameBaseComponent } from "../frame-base-component";
import { on } from "framebus";
import uuid from "@braintree/uuid";

jest.mock("framebus");
jest.mock("@braintree/uuid");
jest.mock("../frame-base-component");

describe("ParentComponent", () => {
  beforeEach(() => {
    jest.mocked(uuid).mockReturnValue("fake-uuid");
  });

  it("should create channel with unique id", () => {
    new ParentComponent({
      url: "https://example.com/child-frame",
      properties: {
        foo: "bar",
      },
    });

    expect(FrameBaseComponent).toBeCalledTimes(1);
    expect(FrameBaseComponent).toBeCalledWith({
      channel: "fake-uuid",
      methods: [],
      hooks: {},
    });
  });

  describe("render", () => {
    beforeEach(() => {
      jest.mocked(on).mockImplementation((config, eventName, cb) => {
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
      });
      const container = document.createElement("div");

      await parent.render(container);

      const iframe = container.querySelector("iframe");
      expect(iframe?.src).toContain("https://example.com/child-frame#");
    });

    it("resolves with the component instance once the child reports it is ready", async () => {
      const parent = new ParentComponent({
        url: "https://example.com/child-frame",
      });
      const container = document.createElement("div");

      const instance = await parent.render(container);

      expect(on).toBeCalledTimes(1);

      expect(instance).toBe(parent);
    });
  });
});
