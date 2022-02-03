import { ChildComponent } from "./child-component";
import { ParentComponent } from "./parent-component";

export type CreateOptions = {
  url: string;
};

export function create(options: CreateOptions) {
  class CustomParent extends ParentComponent {
    static url = options.url;
  }

  class CustomChild extends ChildComponent {
    // custom stuff based on what is passed
  }

  return {
    Parent: CustomParent,
    Child: CustomChild,
  };
}
