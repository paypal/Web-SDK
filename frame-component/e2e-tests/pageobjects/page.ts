/**
 * main page object containing all methods, selectors and functionality
 * that is shared across all page objects
 * see https://martinfowler.com/bliki/PageObject.html
 */
export default class Page {
  public open(path: string): Promise<string> {
    return browser.url(`http://localhost:3000/${path}`);
  }
}
