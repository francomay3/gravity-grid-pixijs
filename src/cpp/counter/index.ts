interface CounterModule {
  createCounter: () => void;
  getCount: () => number;
  increment: () => void;
  decrement: () => void;
  destroyCounter: () => void;
}

class Counter {
  private wasmModule: CounterModule;

  constructor(module: CounterModule) {
    this.wasmModule = module;
    this.wasmModule.createCounter();
  }

  public getCount(): number {
    return this.wasmModule.getCount();
  }

  public increment(): void {
    this.wasmModule.increment();
  }

  public decrement(): void {
    this.wasmModule.decrement();
  }

  public destroy(): void {
    this.wasmModule.destroyCounter();
  }
}

async function createCounter(): Promise<Counter> {
  const wasmModule = await WebAssembly.compileStreaming(
    fetch("/src/counter/counter.wasm")
  );

  const wasmInstance = await WebAssembly.instantiate(wasmModule);

  return new Counter(wasmInstance.exports as unknown as CounterModule);
}

export { Counter, createCounter };
