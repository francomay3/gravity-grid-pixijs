import { Graphics } from "pixi.js";
import { Position } from "./Position";
import { Speed } from "./Speed";
import { Force } from "./Force";
import {
  getRandomSpeedFromKineticEnergyAndMass,
  getRadius,
  biasSpeed,
} from "./utils";

export type PlanetOptions = {
  position: { x: number; y: number };
  mass: number;
  density: number;
  bias: number;
  center: Position;
  color: number;
} & (
  | { speed: { x: number; y: number }; kineticEnergy?: never }
  | { speed?: never; kineticEnergy: number }
);

export class Planet {
  public speed: Speed;
  public position: Position;
  public mass: number;
  public force: Force;
  public graphic: Graphics;
  public radius: number;
  public density: number;
  public willDestroy: boolean;
  public color: number;

  constructor({
    speed,
    kineticEnergy,
    position,
    mass,
    density,
    bias,
    center,
    color,
  }: PlanetOptions) {
    this.position = new Position(position);
    this.mass = mass;
    this.speed = speed
      ? new Speed(speed)
      : getRandomSpeedFromKineticEnergyAndMass(kineticEnergy, mass);
    this.force = new Force({ x: 0, y: 0 });
    this.radius = getRadius(mass, density);
    this.density = density;
    this.color = color;
    this.speed = biasSpeed(this.speed, this.position, center, bias);

    this.willDestroy = false;

    this.graphic = new Graphics().circle(0, 0, this.radius).fill(color);
    this.graphic.position.set(this.position.x, this.position.y);
  }

  public getSpeed(): Speed {
    return this.speed;
  }

  public setPosition(position: { x: number; y: number }): void {
    this.position = new Position(position);
  }

  public setColor(color: number): void {
    this.color = color;
    this.redraw();
  }

  public getPosition(): Position {
    return this.position;
  }

  public getMass(): number {
    return this.mass;
  }

  public addForce(force: Force): void {
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

    this.force = new Force({ x: 0, y: 0 });

    this.graphic.position.set(this.position.x, this.position.y);
  }

  public getGraphic(): Graphics {
    return this.graphic;
  }

  public setSpeed(speed: Speed): void {
    this.speed = speed;
  }

  public getKineticEnergy(): { x: number; y: number } {
    return {
      x: 0.5 * this.mass * this.speed.x ** 2,
      y: 0.5 * this.mass * this.speed.y ** 2,
    };
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
