import { create as createComponent } from "../../src/";

export const { Parent, Child } = createComponent({
    url: "http://localhost:3000/child.html"
})