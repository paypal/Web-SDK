import { ParentComponent } from "../parent-component";

describe("ParentComponent", () => {
  describe("render", () => {
    it("inserts the iframe element into the provided DOM node", async () => {
      const parent = new ParentComponent({ url: "https://example.com/child-frame" });
      const container = document.createElement("div");

      await parent.render(container);

      const iframe = container.querySelector("iframe");
      expect(iframe?.src).toBe("https://example.com/child-frame#");
    });

    it("resolves with the component instance", async () => {
      const parent = new ParentComponent();
      const container = document.createElement("div");

      const instance = await parent.render(container);

      expect(instance).toBe(parent);
    });
  });
});
