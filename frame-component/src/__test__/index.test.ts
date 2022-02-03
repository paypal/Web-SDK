import { create } from "../";
import { ChildComponent } from "../child-component";
import { ParentComponent } from "../parent-component";

describe("FrameComponent", () => {
  describe("create", () => {
    it("returns a parent component", () => {
      const { Parent } = create({
        url: "https://example.com/iframe",
      });

      const parent = new Parent();

      expect(parent).toBeInstanceOf(ParentComponent);
    });

    it("saves url as the static property on the parent", () => {
      const { Parent } = create({
        url: "https://example.com/iframe",
      });

      expect(Parent.url).toBe("https://example.com/iframe");
    });

    it("returns a child component", () => {
      const { Child } = create({
        url: "https://example.com/iframe",
      });

      const child = new Child();

      expect(child).toBeInstanceOf(ChildComponent);
    });
  });
});
