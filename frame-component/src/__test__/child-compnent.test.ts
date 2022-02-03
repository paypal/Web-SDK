import { ChildComponent } from "../child-component";

describe("ChildComponent", () => {
  describe("onCreate", () => {
    it("should call onCreate", async () => {
      const mockFn = jest.fn().mockImplementation(() => {});

      new ChildComponent({ onCreate: mockFn });

      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });
});
