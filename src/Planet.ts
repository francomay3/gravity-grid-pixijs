import { Graphics } from "pixi.js";
import { minMax } from "./utils";
import { app } from "./main";
import { Position } from "./Position";
import { Speed } from "./Speed";
import { Force } from "./Force";

interface PlanetOptions {
  maxSpeed: number;
  maxMass: number;
  force: Force;
}

export class Planet {
  private speed: Speed;
  private position: Position;
  private mass: number;
  private force: Force;
  private graphic: Graphics;

  constructor({ maxSpeed, maxMass, force }: PlanetOptions) {
    this.speed = new Speed({
      x: minMax(-maxSpeed, maxSpeed),
      y: minMax(-maxSpeed, maxSpeed),
    });
    this.position = new Position({
      x: minMax(0, app.screen.width),
      y: minMax(0, app.screen.height),
    });
    this.mass = minMax(0, maxMass);
    this.force = force;
    this.graphic = new Graphics().circle(0, 0, 10).fill(0xff0000);
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

  public destroy(): void {
    this.graphic.destroy();
  }

  public addForceFrom(planet: Planet): void {
    if (planet === this) {
      return;
    }

    const distance = this.position.distance(planet.getPosition());

    const force = {
      x:
        (planet.getMass() / distance) *
        (planet.getPosition().x - this.getPosition().x),
      y:
        (planet.getMass() / distance) *
        (planet.getPosition().y - this.getPosition().y),
    };

    this.addForce(force);
  }
}
