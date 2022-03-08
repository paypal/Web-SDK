export type FraudnetOptions = {
  env: string;
  clientMetadataId: string;
  cspNonce?: string;
  timeout: string;
  sessionId?: string;
  fraudnetSource: string;
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
  protected fraudnetSource: string;

  constructor(options: FraudnetOptions) {
    this.env = options.env;
    this.clientMetadataID = options.clientMetadataId;
    this.cspNonce = options.cspNonce;
    this.timeout = options.timeout;
    this.sessionId = options.sessionId || this.generateSessionId();
    this.fraudnetSource = options.fraudnetSource;
  }

  loadFraudnet() {
    this.loadConfig();
  }

  removeFraudnet() {
    // Todo
  }

  private loadConfig() {
    const body = this.getBody();
    const config: ConfigScriptProperties = {
      f: this.sessionId as string,
      s: this.fraudnetSource,
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
    body.appendChild(configScript);
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
}
