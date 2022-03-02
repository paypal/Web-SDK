import { createParent } from "frame-component";

type RenderOptions = {
  textInputs: Array<{
    url: string;
    title: string;
    container: HTMLElement;
  }>;
};

export function render(options: RenderOptions) {
  options.textInputs.forEach(({ url, title, container }) => {
    createParent({
      url,
      title,
    }).render(container);
  });
}
