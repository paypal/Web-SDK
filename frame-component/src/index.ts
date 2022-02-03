import { ChildComponent } from "./child-component";
import { ParentComponent } from "./parent-component";

export type CreateOptions = {
  url: string;
};

export function create(options: CreateOptions) {
  class MyCustomParent extends ParentComponent {
    // custom stuff based on what is passed 
  }
  class MyCustomChild extends ChildComponent {
    // custom stuff based on what is passed 
  }
  return {
    Parent: MyCustomParent,
    Child: MyCustomChild,
  };
}
