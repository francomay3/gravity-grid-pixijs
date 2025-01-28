import { Graphics } from "pixi.js";
import {
  getRandomSpeedDirectionFromKineticEnergyAndMass,
  getRadius,
  biasSpeed,
} from "./utils";
import { Coordinates } from "./Coordinates";

export type PlanetOptions = {
  position: Coordinates;
  mass: number;
  density: number;
  bias: number;
  center: Coordinates;
  color: number;
} & (
  | { speed: Coordinates; kineticEnergy?: never }
  | { speed?: never; kineticEnergy: number }
);

export class Planet {
  public speed: Coordinates;
  public position: Coordinates;
  public mass: number;
  public force: Coordinates;
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
    this.position = position;
    this.mass = mass;
    this.speed = speed
      ? speed
      : getRandomSpeedDirectionFromKineticEnergyAndMass(kineticEnergy, mass);
    this.force = new Coordinates(0, 0);
    this.radius = getRadius(mass, density);
    this.density = density;
    this.color = color;
    this.speed = biasSpeed(this.speed, this.position, center, bias);

    this.willDestroy = false;

    this.graphic = new Graphics().circle(0, 0, this.radius).fill(color);
    this.graphic.position.set(this.position.x, this.position.y);
  }

  public getSpeed(): Coordinates {
    return this.speed;
  }

  public setPosition(position: Coordinates): void {
    this.position = new Coordinates(position.x, position.y);
  }

  public setColor(color: number): void {
    this.color = color;
    this.redraw();
  }

  public getPosition(): Coordinates {
    return this.position;
  }

  public getMass(): number {
    return this.mass;
  }

  public addForce(force: Coordinates): void {
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

    this.force = new Coordinates(0, 0);

    this.graphic.position.set(this.position.x, this.position.y);
  }

  public getGraphic(): Graphics {
    return this.graphic;
  }

  public setSpeed(speed: Coordinates): void {
    this.speed = speed;
  }

  public getKineticEnergy(): Coordinates {
    return new Coordinates(
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
