import { sdk } from "@paypal/web-sdk/src/";
import { Field } from "@paypal/ui-components";

export function Home() {
  sdk();

  return (
    <div>
      <h1>Home</h1>

      <Field name="card-field" style={{ color: "red" }} />

      {/* <CardNumber /> */}
    </div>
  );
}
