import { ParentComponent } from "../parent-component";

describe("ParentComponent", () => {
  describe("render", () => {
    it("inserts the iframe element into the provided DOM node", async () => {
      const parent = new ParentComponent();
      const container = document.createElement("div");

      await parent.render(container);

      expect(container.querySelector("iframe")).toBeTruthy();
    });

    it("resolves with the component instance", async () => {
      const parent = new ParentComponent();
      const container = document.createElement("div");

      const instance = await parent.render(container);

      expect(instance).toBe(parent);
    });
  });
});
