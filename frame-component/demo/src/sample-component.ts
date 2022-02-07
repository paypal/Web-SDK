import { createParent, createChild } from "../../src";

export const parentComponent = createParent({
  url: "http://localhost:3000/child.html",
});

export const childComponent = createChild({});
