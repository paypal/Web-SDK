import { loadScript } from "@braintree/asset-loader";

export type FraudnetOptions = {
  env: string;
  clientMetadataId: string;
  cspNonce?: string;
  timeout: string;
  sessionId?: string;
  fraudnetAppName: string;
  fraudnetURL: string;
};

export type ConfigScriptProperties = {
  f: string;
  s: string;
  b: string;
  sandbox?: boolean;
};

export class Fraudnet {
  protected env: string;
  protected clientMetadataID: string;
  protected cspNonce?: string;
  protected timeout: string;
  sessionId?: string;
  protected fraudnetAppName: string;
  protected fraudnetURL: string;
  thirdPartyScript?: HTMLScriptElement;
  configScript?: HTMLScriptElement;

  constructor(options: FraudnetOptions) {
    this.env = options.env;
    this.clientMetadataID = options.clientMetadataId;
    this.cspNonce = options.cspNonce;
    this.timeout = options.timeout;
    this.sessionId = options.sessionId || this.generateSessionId();
    this.fraudnetAppName = options.fraudnetAppName;
    this.fraudnetURL = options.fraudnetURL;
  }

  loadFraudnet() {
    return this.initialize();
  }

  removeFraudnet() {
    const ppfniframe = document.querySelector(
      'iframe[title="ppfniframe"]'
    ) as HTMLElement;
    const pbf = document.querySelector('iframe[title="pbf"]') as HTMLElement;
    const elementsToRemove = [
      ppfniframe,
      pbf,
      this.thirdPartyScript as HTMLScriptElement,
      this.configScript as HTMLScriptElement,
    ];
    elementsToRemove.forEach((element) => {
      this.removeElementIfOnPage(element);
    });
  }

  private initialize() {
    this.configScript = this.loadConfig();
    return this.loadFraudnetScript();
  }

  private loadConfig() {
    const body = this.getBody();
    const config: ConfigScriptProperties = {
      f: this.sessionId as string,
      s: this.fraudnetAppName,
      b: this.generateBeaconId(this.sessionId as string),
    };
    if (this.env !== "production") {
      config.sandbox = true;
    }
    const configScript = document.createElement("script");
    configScript.setAttribute("type", "application/json");
    configScript.setAttribute(
      "fncls",
      "fnparams-dede7cc5-15fd-4c75-a9f4-36c430ee3a99"
    );
    configScript.textContent = JSON.stringify(config);
    const el = body.appendChild(configScript);
    return el;
  }

  private async loadFraudnetScript() {
    const script = await loadScript({ src: this.fraudnetURL });
    this.thirdPartyScript = script;
  }

  private getBody() {
    const body = document.body;

    if (!body) {
      throw new Error("Document body not found");
    }

    return body;
  }

  private generateSessionId(): string {
    let i: number, id!: string;

    for (i = 0; i < 32; i++) {
      id += Math.floor(Math.random() * 16).toString(16);
    }
    return id;
  }

  private generateBeaconId(sessionId: string) {
    const timestamp = new Date().getTime() / 1000;

    return (
      "https://b.stats.paypal.com/counter.cgi" +
      "?i=127.0.0.1" +
      "&p=" +
      sessionId +
      "&t=" +
      timestamp +
      "&a=14"
    );
  }

  private removeElementIfOnPage(element?: HTMLElement) {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }
}
