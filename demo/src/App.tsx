// import { Logo } from './logo'
import { createParent } from "frame-component/src";
import { useRef, useEffect } from "preact/hooks";

export function loadMySpecialComponent(container: HTMLElement) {
  createParent({
    url: "http://localhost:9001/v1/child/",
    title: "some title",
    properties: {
      text: "</div><script>alert('hey')</script><div>",
    },
  })
    .render(container)
    .then(() => {
      console.log("I did resolve");
    });
}

export function App() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMySpecialComponent(container.current as HTMLDivElement);
  }, []);

  return (
    <>
      <div>Logo would go here</div>
      <p>Hello Vite + Preact!</p>
      <p>
        <a
          class="link"
          href="https://preactjs.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Preact
        </a>
      </p>
      <div id="container" ref={container}></div>
    </>
  );
}
