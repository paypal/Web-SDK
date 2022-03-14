import { Fraudnet, FraudnetOptions } from "./fraudnet";

export function createFraudnet(options: FraudnetOptions): Fraudnet {
  return new Fraudnet(options);
}
