class State<T> {
  public current: T;
  private subscribers: ((state: T) => void)[] = [];

  constructor(initial: T) {
    this.current = initial;
  }

  public set(next: T): void {
    this.current = next;
    this.subscribers.forEach((cb) => cb(this.current));
  }

  public subscribe(cb: (state: T) => void): void {
    this.subscribers.push(cb);
  }

  public unsubscribe(cb: (state: T) => void): void {
    this.subscribers = this.subscribers.filter((sub) => sub !== cb);
  }
}

export const exampleState = new State<number>(0);
