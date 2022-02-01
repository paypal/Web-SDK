import { ChildComponent } from "./child-component";
import { ParentComponent } from "./parent-component";

export type CreateOptions = {
  url: string;
};

export function create(options: CreateOptions) {
  return {
    Parent: ParentComponent,
    Child: ChildComponent,
  };
}
