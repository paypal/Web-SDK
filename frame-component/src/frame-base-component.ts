import { initialize, FramebusConfig, on, emitAsPromise } from "framebus";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Hook = (...args: any[]) => void;
type Methods = string[];
type Hooks = {
  [key: string]: Hook;
};
type HookResponse = {
  error?: unknown;
  result?: unknown;
};

export type FrameComponentProps = {
  channel: string;
  methods: Methods;
  hooks: Hooks;
};

export abstract class FrameBaseComponent {
  protected busConfig: FramebusConfig;
  protected channel: string;

  methods: Hooks = {};

  constructor(options: FrameComponentProps) {
    this.channel = options.channel;
    this.busConfig = initialize({
      channel: this.channel,
    });

    const methodsHaveOverlappingNameWithHooks = options.methods.find((name) => {
      return name in options.hooks;
    });

    if (methodsHaveOverlappingNameWithHooks) {
      throw new Error(
        "Implementation Error: hooks and methods must have unique names"
      );
    }

    this.setMethods(options.methods);
    this.setHooks(options.hooks);
  }

  private setMethods(methods: Methods) {
    for (const methodName of methods) {
      if (this.methods[methodName]) {
        throw new Error(
          "Implementation Error: multiple instances of method 'foo' detected"
        );
      }

      this.methods[methodName] = this.createMethod(methodName);
    }
  }

  private createMethod(methodName: string) {
    return async (...args: unknown[]) => {
      const { error, result } = await emitAsPromise<HookResponse>(
        this.busConfig,
        `trigger-method-${methodName}`,
        {
          args,
        }
      );

      if (error) {
        return Promise.reject(this.deserializeError(error));
      }
      return result;
    };
  }

  private setHooks(hooksMap: Hooks) {
    for (const [methodName, hook] of Object.entries(hooksMap)) {
      on(
        this.busConfig,
        `trigger-method-${methodName}`,
        this.createHookCallback(hook)
      );
    }
  }

  private createHookCallback(hook: Hook): Parameters<typeof on>[2] {
    return async (data, reply) => {
      const args = data.args as unknown[];

      try {
        // wrap the result of the hook function in a promise
        // so that it always returns a promise, even if the
        // definition for the hook does not
        const result = await Promise.resolve(hook(...args));

        reply({
          result,
        });
      } catch (error) {
        reply({ error: this.serializeError(error) });
      }
    };
  }

  private serializeError(error: unknown) {
    // errors can't be serialized over post message,
    // so we send down just the message from the error
    if (error instanceof Error) {
      return error.message;
    }

    return error;
  }

  private deserializeError(error: unknown) {
    if (typeof error === "string") {
      return new Error(error);
    }
    return error;
  }
}
