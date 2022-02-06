import { ChildComponent } from "../child-component";
import { ParentComponent } from "../parent-component";

describe("ChildComponent", () => {
  describe("onCreate", () => {
    it("should call onCreate", async () => {
      const mockFn = jest.fn().mockImplementation(() => {});
      new ParentComponent({});
      new ChildComponent({ onCreate: mockFn });
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });
});
