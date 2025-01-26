interface SpeedOptions {
  x: number;
  y: number;
}

export class Speed {
  public x: number;
  public y: number;

  constructor({ x, y }: SpeedOptions) {
    this.x = x;
    this.y = y;
  }
}
