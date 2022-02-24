import { initialize, FramebusConfig, on, off, emitAsPromise } from "framebus";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Hook = (...args: any[]) => void;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Method = (...args: any[]) => Promise<unknown>;
type Methods = {
  [key: string]: Method;
};
type Hooks = {
  [key: string]: Hook;
};
type MethodNames = string[];
type HookResponse = {
  error?: unknown;
  result?: unknown;
};

export type FrameComponentOptions = {
  channel: string;
  methods: MethodNames;
  // hooks: Hooks;
};

export abstract class FrameBaseComponent {
  protected busConfig: FramebusConfig;
  protected channel: string;
  private definedHooks: Record<string, Parameters<typeof on>[2]> = {};

  methods: Methods = {};

  constructor(options: FrameComponentOptions) {
    this.channel = options.channel;
    this.busConfig = initialize({
      channel: this.channel,
    });

    // TODO: evaluate these scenario when applied to the `defineHooks` approach. See test in
    // framebase tests.
    // const methodsHaveOverlappingNameWithHooks = options.methods.find((name) => {
    //   return name in options.hooks;
    // });

    // if (methodsHaveOverlappingNameWithHooks) {
    //   throw new Error(
    //     "Implementation Error: hooks and methods must have unique names"
    //   );
    // }

    this.setMethods(options.methods);
  }

  defineHook(methodName: string, hook: Hook) {
    const eventName = `trigger-method-${methodName}`;

    if (this.definedHooks[methodName]) {
      off(this.busConfig, eventName, this.definedHooks[methodName]);
    }

    const cb = this.createHookCallback(hook);

    this.definedHooks[methodName] = cb;

    on(this.busConfig, eventName, cb);
  }

  private setMethods(methods: MethodNames) {
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

  protected createHookCallback(hook: Hook): Parameters<typeof on>[2] {
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
