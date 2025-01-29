import { Container, Graphics } from "pixi.js";
import { getRadius } from "./utils";
import { Vector2 } from "./vector2";

export type PlanetOptions = {
  position: Vector2;
  mass: number;
  density: number;
  color: number;
  speed: Vector2;
} & (
  | { speed: Vector2; kineticEnergy?: never }
  | { speed?: never; kineticEnergy: number }
);

export class Planet {
  public speed: Vector2;
  public position: Vector2;
  public mass: number;
  public force: Vector2;
  public graphic: Graphics;
  public radius: number;
  public density: number;
  public willDestroy: boolean;
  public color: number;
  public container: Container;

  constructor({ position, mass, density, color, speed }: PlanetOptions) {
    this.container = new Container();
    this.position = position;
    this.mass = mass;

    this.force = new Vector2(0, 0);
    this.radius = getRadius(mass, density);
    this.density = density;
    this.color = color;
    this.speed = speed;

    this.willDestroy = false;

    this.graphic = new Graphics().circle(0, 0, this.radius).fill(color);
    this.graphic.position.set(this.position.x, this.position.y);
    this.container.addChild(this.graphic);
  }

  public getSpeed(): Vector2 {
    return this.speed;
  }

  public setPosition(position: Vector2): void {
    this.position = new Vector2(position.x, position.y);
  }

  public setColor(color: number): void {
    this.color = color;
    this.redraw();
  }

  public getPosition(): Vector2 {
    return this.position;
  }

  public getMass(): number {
    return this.mass;
  }

  public addForce(force: Vector2): void {
    this.force.x += force.x;
    this.force.y += force.y;
  }

  public update(delta: number): void {
    const acceleration = {
      x: this.force.x / this.mass,
      y: this.force.y / this.mass,
    };

    this.speed.x += acceleration.x * delta;
    this.speed.y += acceleration.y * delta;

    this.position.x += this.speed.x * delta;
    this.position.y += this.speed.y * delta;

    this.force = new Vector2(0, 0);

    this.graphic.position.set(this.position.x, this.position.y);
  }

  public setSpeed(speed: Vector2): void {
    this.speed = speed;
  }

  public getKineticEnergy(): Vector2 {
    return new Vector2(
      0.5 * this.mass * this.speed.x ** 2,
      0.5 * this.mass * this.speed.y ** 2
    );
  }

  public destroy(): void {
    this.graphic.destroy();
  }

  public redraw(): void {
    this.graphic.clear();
    this.graphic.circle(0, 0, this.radius).fill(this.color);
  }

  public setMass(mass: number): void {
    this.mass = mass;
    this.radius = getRadius(mass, this.density);
    this.redraw();
  }
}
