import { createFraudnet } from "../index";
import { Fraudnet, FraudnetOptions } from "../fraudnet";

describe("Fraudnet", () => {
  let options: FraudnetOptions;
  beforeEach(() => {
    options = {
      env: "sand",
      clientMetadataId: "cmid123",
      cspNonce: "cspNonce1",
      timeout: "5s",
      sessionId: "id123",
    };
  });
  describe("createFraudnet", () => {
    it("returns a fraudnet instance", () => {
      const fraudnet = createFraudnet(options);

      expect(fraudnet).toBeInstanceOf(Fraudnet);
    });
  });
  describe("loadScript", () => {
    it("loads a fraudnet script on the page", () => {
      // todo
      // shouldn't load more than once on the page
    });
    it("loads a config script on the page", () => {
      // todo
      // shouldn't load more than once on the page
    });
    it("configures for sandbox mode when specified", () => {
      // todo
    });
  });
  describe("removeScript", () => {
    it("removes the fraudnet script on the page", () => {
      //  todo
    });
  });
});
