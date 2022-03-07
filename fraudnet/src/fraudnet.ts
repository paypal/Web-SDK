export type FraudnetOptions = {
  env: string;
  clientMetadataId: string;
  cspNonce?: string;
  timeout: string;
  sessionId: string;
};

export class Fraudnet {
  protected env: string;
  protected clientMetadataID: string;
  protected cspNonce?: string;
  protected timeout: string;
  protected sessionId: string;

  constructor(options: FraudnetOptions) {
    this.env = options.env;
    this.clientMetadataID = options.clientMetadataId;
    this.cspNonce = options.cspNonce;
    this.timeout = options.timeout;
    this.sessionId = options.sessionId;
  }

  loadScript() {
    // Todo
  }

  removeScript() {
    // Todo
  }

  private getBody() {
    // Todo
  }
}
