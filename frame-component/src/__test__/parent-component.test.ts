import { ParentComponent } from "../parent-component";

class CustomParentComponent extends ParentComponent {
  static url: string = "https://example.com/child-frame";
}

describe("ParentComponent", () => {
  describe("render", () => {
    it("inserts the iframe element into the provided DOM node", async () => {
      const parent = new CustomParentComponent();
      const container = document.createElement("div");

      await parent.render(container);

      const iframe = container.querySelector("iframe");
      expect(iframe?.src).toBe("https://example.com/child-frame");
    });

    it("resolves with the component instance", async () => {
      const parent = new CustomParentComponent();
      const container = document.createElement("div");

      const instance = await parent.render(container);

      expect(instance).toBe(parent);
    });
  });
});
