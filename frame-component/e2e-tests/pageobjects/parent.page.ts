import type { ChainablePromiseElement } from "webdriverio";

import Page from "./page";

/**
 * Page object that represents the parent page that hosts the iframe
 */
class ParentPage extends Page {
  public get inputBackgroundColorChoice(): ChainablePromiseElement<
    Promise<WebdriverIO.Element>
  > {
    return $("#background-color-choice");
  }

  public get inputBackgroundColorSubmit(): ChainablePromiseElement<
    Promise<WebdriverIO.Element>
  > {
    return $("#background-color-submit");
  }

  public get inputBackgroundColorGet(): ChainablePromiseElement<
    Promise<WebdriverIO.Element>
  > {
    return $("#background-color-get");
  }

  public get messageElement(): ChainablePromiseElement<
    Promise<WebdriverIO.Element>
  > {
    return $("#message-from-iframe");
  }

  public async changeBackground(color: string): Promise<void> {
    await this.inputBackgroundColorChoice.setValue(color);
    await this.inputBackgroundColorSubmit.click();
  }

  public async askForIframeBackground(): Promise<string> {
    await this.inputBackgroundColorGet.click();

    await browser.waitUntil(
      async () => (await this.inputBackgroundColorChoice.getValue()) !== "",
      {
        timeout: 5000,
        timeoutMsg: "Background color choice never populated as expected.",
      }
    );

    return this.inputBackgroundColorChoice.getValue();
  }

  public async getMessage(): Promise<string> {
    await browser.waitUntil(
      async () => (await this.messageElement.getText()) !== "",
      {
        timeout: 5000,
        timeoutMsg: "Message never populated after 5 seconds",
      }
    );
    const message = await this.messageElement.getText();

    return message;
  }

  public async open(): Promise<void> {
    await super.open("");
    // wait for the page to report that everything is set up
    await $(".ready").waitForExist();
  }
}

export default new ParentPage();
