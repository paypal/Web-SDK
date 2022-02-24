import type { ChainablePromiseElement } from "webdriverio";

import Page from "./page";

/**
 * Page object that represents the iframe placed on the parent page
 */
class IframePage extends Page {
  public get backgroundElement(): ChainablePromiseElement<
    Promise<WebdriverIO.Element>
  > {
    return $("#app");
  }

  public get sendMessageInput(): ChainablePromiseElement<
    Promise<WebdriverIO.Element>
  > {
    return $("#send-message-input");
  }

  public get sendMessageButton(): ChainablePromiseElement<
    Promise<WebdriverIO.Element>
  > {
    return $("#send-message-button");
  }

  public async getCurrentBackgroundColor(): Promise<string> {
    let backgroundValue: string;

    await this.inFrame(async () => {
      const cssProps = await this.backgroundElement.getCSSProperty(
        "backgroundColor"
      );
      backgroundValue = cssProps.value;
    });

    return backgroundValue;
  }

  public async sendMessage(message: string): Promise<void> {
    await this.inFrame(async () => {
      await this.sendMessageInput.setValue(message);
      await this.sendMessageButton.click();
    });
  }

  private async inFrame(cb: () => void): Promise<void> {
    const iframe = await $("#main iframe");

    await browser.switchToFrame(iframe);

    await cb();

    await browser.switchToFrame(null);
  }
}

export default new IframePage();
