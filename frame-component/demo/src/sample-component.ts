import { parent, child } from "../../src";

export const parentComponent = parent({
  url: "http://localhost:3000/child.html",
});

export const childComponent = child();
