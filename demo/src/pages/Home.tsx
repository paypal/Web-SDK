import { sdk } from "@paypal/web-sdk/src/";
export function Home() {
  sdk();

  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}
