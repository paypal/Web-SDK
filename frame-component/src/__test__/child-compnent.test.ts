import { ChildComponent } from "../child-component";
import { emit, initialize } from "framebus";

jest.mock("framebus");

describe("ChildComponent", () => {
  it("initializes framebus with a channel from the url hash", () => {
    const originalLocation = window.location;
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = {
      hash: "#unique-id"
    }

    const child =  new ChildComponent({ 
      onCreate: jest.fn()
    })

    expect(initialize).toBeCalledTimes(1);
    expect(initialize).toBeCalledWith({
      channel: "unique-id"
    });

    window.location = originalLocation;
  });

  it("emits a child-ready event", () => {
    const child =  new ChildComponent({ 
      onCreate: jest.fn()
    })

    expect(emit).toBeCalledTimes(1);
    expect(emit).toBeCalledWith(undefined, "child-ready", {}, expect.any(Function));
  });

  it("calls configured onCreate method with parent properties recieved from the child-ready event", () => {
    jest.mocked(emit).mockImplementation((config, eventName, data, cb) => {
      if (cb) {
        cb({
          properties: {
            parentProperty: "foo"
          }
        });
      }
      
      return true;
    });
    const onCreate = jest.fn();

    new ChildComponent({ 
      onCreate
    });

    expect(onCreate).toBeCalledTimes(1);
    expect(onCreate).toBeCalledWith({
      properties: {
        parentProperty: "foo"
      }
    });
  });

  it("allows onCreate property to be optional", () => {
    jest.mocked(emit).mockImplementation((config, eventName, data, cb) => {
      if (cb) {
        cb({
          parentProperty: "foo"
        });
      }
      
      return true;
    });

    expect(() => {
      new ChildComponent({});
    }).not.toThrow();
  });
});
