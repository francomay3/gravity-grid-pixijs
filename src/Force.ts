interface ForceOptions {
  x: number;
  y: number;
}

export class Force {
  public x: number;
  public y: number;

  constructor({ x, y }: ForceOptions) {
    this.x = x;
    this.y = y;
  }
}
