export class Coordinates {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public set(coordinates: Coordinates): void {
    this.x = coordinates.x;
    this.y = coordinates.y;
  }

  public inverse(): Coordinates {
    return new Coordinates(-this.x, -this.y);
  }

  public distanceTo(coordinates: Coordinates): number {
    return Math.sqrt(
      (this.x - coordinates.x) ** 2 + (this.y - coordinates.y) ** 2
    );
  }
}
