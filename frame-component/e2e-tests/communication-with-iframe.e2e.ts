import ParentPage from "./pageobjects/parent.page";
import IframePage from "./pageobjects/iframe.page";

describe("Page with iframe on it", () => {
  it("can communicate from the parent to the child iframe", async () => {
    await ParentPage.open();

    const iframeBackground = await ParentPage.askForIframeBackground();
    expect(iframeBackground).toBe("lightblue");

    const originalBackgroundColorAsCssProp =
      await IframePage.getCurrentBackgroundColor();

    const lightblue = "rgba(173,216,230,1)";
    expect(originalBackgroundColorAsCssProp).toBe(lightblue);

    await ParentPage.changeBackground("lavenderblush");

    const backgroundColor = await IframePage.getCurrentBackgroundColor();

    const lavender = "rgba(255,240,245,1)";
    expect(backgroundColor).toBe(lavender);
  });

  it("can communicate from the child to the parent iframe", async () => {
    await ParentPage.open();

    await IframePage.sendMessage("some message");

    const message = await ParentPage.getMessage();

    expect(message).toBe("some message");
  });
});
