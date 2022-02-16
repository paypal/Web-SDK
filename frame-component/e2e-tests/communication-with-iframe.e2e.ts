import ParentPage from "./pageobjects/parent.page";
import IframePage from "./pageobjects/iframe.page";

describe("Page with iframe on it", () => {
  it("can communicate from the parent to the child iframe", async () => {
    await ParentPage.open();

    const originalBackgroundColor =
      await IframePage.getCurrentBackgroundColor();

    const red = "rgba(255,0,0,1)";
    expect(originalBackgroundColor).toBe(red);

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
