import { Graphics } from "pixi.js";
import { Position } from "./Position";
import { Speed } from "./Speed";
import { Force } from "./Force";
import {
  getSpeedAfterCollission,
  getPositionAfterCollission,
  getRandomSpeedFromKineticEnergyAndMass,
  getRadius,
} from "./utils";

export type PlanetOptions = {
  position: { x: number; y: number };
  mass: number;
  density: number;
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

  constructor({
    speed,
    kineticEnergy,
    position,
    mass,
    density,
  }: PlanetOptions) {
    this.position = new Position(position);
    this.mass = mass;
    this.speed = speed
      ? new Speed(speed)
      : getRandomSpeedFromKineticEnergyAndMass(kineticEnergy, mass);
    this.force = { x: 0, y: 0 };
    this.radius = getRadius(mass, density);
    this.density = density;

    this.willDestroy = false;

    this.graphic = new Graphics().circle(0, 0, this.radius).fill(0xff0000);
    this.graphic.position.set(this.position.x, this.position.y);
  }

  public getSpeed(): Speed {
    return this.speed;
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
    this.speed.x += this.force.x * delta;
    this.speed.y += this.force.y * delta;

    this.position.x += this.speed.x * delta;
    this.position.y += this.speed.y * delta;

    this.force = { x: 0, y: 0 };

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
    this.graphic.circle(0, 0, this.radius).fill(0xff0000);
  }

  public setMass(mass: number): void {
    this.mass = mass;
    this.radius = getRadius(mass, this.density);
    this.redraw();
  }

  public addForceFrom(planet: Planet, G: number): void {
    if (planet === this || planet.willDestroy || this.willDestroy) {
      return;
    }

    const distance = this.position.distance(planet.getPosition());

    if (distance < this.radius + planet.radius) {
      this.willDestroy = true;
      const newMass = this.mass + planet.mass;
      const newSpeed = getSpeedAfterCollission(this, planet);
      const newPosition = getPositionAfterCollission(this, planet);
      planet.speed = newSpeed;
      planet.setMass(newMass);
      planet.position = newPosition;
      return;
    }

    const force = {
      x:
        G *
        (planet.getMass() / distance) *
        (planet.getPosition().x - this.getPosition().x) *
        0.0001, // this is so that I dont need to use Gs that are so small
      y:
        G *
        (planet.getMass() / distance) *
        (planet.getPosition().y - this.getPosition().y) *
        0.0001,
    };

    this.addForce(force);
  }
}
