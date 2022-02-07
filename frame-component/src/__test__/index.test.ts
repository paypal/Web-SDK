import { createParent, createChild } from "../";
import { ChildComponent } from "../child-component";
import { ParentComponent } from "../parent-component";

describe("FrameComponent", () => {
  describe("create", () => {
    it("returns a parent component", () => {

      const parentComponent = createParent({
        url: "https://example.com/iframe",
      });

      expect(parentComponent).toBeInstanceOf(ParentComponent);
    });

    it("saves url as the static property on the parent", () => {
      const parentComponent = createParent({
        url: "https://example.com/iframe",
      });

      expect(parentComponent.url).toBe("https://example.com/iframe");
    });

    it("returns a child component", () => {
      const childComponent = createChild({});

      expect(childComponent).toBeInstanceOf(ChildComponent);
    });
  });
});
