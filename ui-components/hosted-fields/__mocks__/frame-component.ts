import type { ParentComponent } from "frame-component/src/parent-component";
import type { ChildComponent } from "frame-component/src/child-component";

export const fakeParent = {
  render: jest.fn(),
};

fakeParent.render.mockResolvedValue(fakeParent);

export const fakeChild = {
  reportReady: jest.fn(),
};

export const createParent = jest.fn().mockImplementation(() => {
  return fakeParent as unknown as ParentComponent;
});

export const createChild = jest.fn().mockImplementation(() => {
  return fakeChild as unknown as ChildComponent;
});
