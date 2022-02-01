import { create } from "../";
import { ChildComponent } from "../child-component";
import { ParentComponent } from "../parent-component";

describe("FrameComponent", () => {
  describe("create", () => {
    it("returns a parent component", () => {
      const component = create({
        url: "https://example.com/iframe",
      });

      const parent = new component.Parent();

      expect(parent).toBeInstanceOf(ParentComponent);
    });

    it("returns a child component", () => {
      const component = create({
        url: "https://example.com/iframe",
      });

      const child = new component.Child();

      expect(child).toBeInstanceOf(ChildComponent);
    });
  });
});
