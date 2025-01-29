export class Vector2 {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public set(vector: Vector2): void {
    this.x = vector.x;
    this.y = vector.y;
  }

  public inverse(): Vector2 {
    return new Vector2(-this.x, -this.y);
  }

  public distanceTo(vector: Vector2): number {
    return Math.sqrt((this.x - vector.x) ** 2 + (this.y - vector.y) ** 2);
  }

  public multiply(value: number): Vector2 {
    return new Vector2(this.x * value, this.y * value);
  }

  public add(vector: Vector2): Vector2 {
    return new Vector2(this.x + vector.x, this.y + vector.y);
  }

  public rotate(angle: number): Vector2 {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vector2(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos
    );
  }
}
