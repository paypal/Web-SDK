import { createFraudnet } from "../index";
import { Fraudnet, FraudnetOptions } from "../fraudnet";
import { loadScript } from "@braintree/asset-loader";

jest.mock("@braintree/asset-loader");

describe("Fraudnet", () => {
  let options: FraudnetOptions;

  beforeEach(() => {
    options = {
      env: "sandbox",
      clientMetadataId: "cmid123",
      cspNonce: "cspNonce1",
      timeout: "5s",
      fraudnetAppName: "APP_USING_FRAUDNET",
      fraudnetURL: "https://example.com",
    };
    const fnScript = document.createElement("script");
    fnScript.setAttribute("src", options.fraudnetURL);
    jest.mocked(loadScript).mockResolvedValue(fnScript);
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  describe("createFraudnet", () => {
    it("returns a fraudnet instance", () => {
      const fraudnet = createFraudnet(options);

      expect(fraudnet).toBeInstanceOf(Fraudnet);
    });
  });

  describe("loadFraudnet", () => {
    it("loads a fraudnet script on the page with the specified source", async () => {
      const fraudnet = createFraudnet(options);

      await fraudnet.loadFraudnet();

      expect(loadScript).toBeCalledTimes(1);
      expect(loadScript).toBeCalledWith({ src: "https://example.com" });
    });

    it("loads a config script on the page", () => {
      const fraudnet = createFraudnet(options);

      fraudnet.loadFraudnet();

      const sessionId = fraudnet.sessionId;

      const el = document.querySelector(
        '[fncls][type="application/json"]'
      ) as HTMLScriptElement;
      const parsedData = JSON.parse(el.textContent as string);

      expect(parsedData.f).toBe(sessionId);
      expect(parsedData.s).toBe("APP_USING_FRAUDNET");
      expect(parsedData.b).toContain(sessionId);
    });

    it("can pass a custom session id", () => {
      options.sessionId = "CUSTOM_ID";
      const fraudnet = createFraudnet(options);

      expect(fraudnet.sessionId).toBe("CUSTOM_ID");
    });

    it("includes a sandbox param when sandbox env is passed", () => {
      const fraudnet = createFraudnet(options);

      fraudnet.loadFraudnet();

      const el = document.querySelector(
        '[fncls][type="application/json"]'
      ) as HTMLScriptElement;
      const parsedData = JSON.parse(el.textContent as string);

      expect(parsedData).toHaveProperty("sandbox");
    });

    it("does not include a sandbox param when production env is passed", () => {
      options.env = "production";
      const fraudnet = createFraudnet(options);

      fraudnet.loadFraudnet();

      const el = document.querySelector(
        '[fncls][type="application/json"]'
      ) as HTMLScriptElement;
      const parsedData = JSON.parse(el.textContent as string);

      expect(parsedData).not.toHaveProperty("sandbox");
    });
  });

  describe("removeFraudnet", () => {
    it("removes the fraudnet script on the page", async () => {
      const fraudnet = createFraudnet(options);

      await fraudnet.loadFraudnet();
      console.log(fraudnet);

      const ppfniframe = document.createElement("iframe");
      ppfniframe.setAttribute("title", "ppfniframe");
      const pbf = document.createElement("iframe");
      pbf.setAttribute("title", "pbf");
      const configScript = fraudnet.configScript;
      const fraudnetScript = fraudnet.fraudnetScript;

      document.body.appendChild(configScript as HTMLScriptElement);
      document.body.appendChild(fraudnetScript as HTMLScriptElement);
      document.body.appendChild(ppfniframe);
      document.body.appendChild(pbf);

      expect(document.body.childNodes.length).toBe(4);
      fraudnet.removeFraudnet();
      expect(document.body.childNodes.length).toBe(0);
    });
  });
});
