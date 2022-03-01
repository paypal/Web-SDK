import { createParent, createChild } from "../";
import { ChildComponent } from "../child-component";
import { ParentComponent } from "../parent-component";

describe("FrameComponent", () => {
  describe("create", () => {
    it("returns a parent component", () => {
      const parentComponent = createParent({
        url: "https://example.com/iframe",
        title: "Iframe Title",
      });

      expect(parentComponent).toBeInstanceOf(ParentComponent);
    });

    it("returns a child component", () => {
      const childComponent = createChild({});

      expect(childComponent).toBeInstanceOf(ChildComponent);
    });
  });
});
