interface PositionOptions {
  x: number;
  y: number;
}

export class Position {
  public x: number;
  public y: number;

  constructor({ x, y }: PositionOptions) {
    this.x = x;
    this.y = y;
  }

  public distance(point: Position): number {
    return Math.sqrt(
      Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2)
    );
  }
}
