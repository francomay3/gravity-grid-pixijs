import { Graphics } from "pixi.js";
import { Planet } from "./Planet";
import { Position } from "./Position";

interface SpaceOptions {
  numberOfPlanets: number;
  maxMass: number;
  maxSpeed: number;
}

export class Space {
  private planets: Planet[];

  constructor({ numberOfPlanets, maxMass, maxSpeed }: SpaceOptions) {
    this.planets = Array.from({ length: numberOfPlanets }).map(
      () =>
        new Planet({
          maxSpeed,
          maxMass,
          force: { x: 0, y: 0 },
        })
    );
  }

  public getSprites(): Graphics[] {
    return this.planets.map((planet) => planet.getGraphic());
  }

  public destroyPlanet(planet: Planet): void {
    planet.destroy();
    this.planets = this.planets.filter((p) => p !== planet);
  }

  public getCenterOfMass(): Position {
    if (this.planets.length === 0) {
      throw new Error("The points array must not be empty.");
    }

    let totalMass = 0;
    let weightedXSum = 0;
    let weightedYSum = 0;

    for (const planet of this.planets) {
      totalMass += planet.getMass();
      weightedXSum += planet.getPosition().x * planet.getMass();
      weightedYSum += planet.getPosition().y * planet.getMass();
    }

    const xCenter = weightedXSum / totalMass;
    const yCenter = weightedYSum / totalMass;

    return new Position({ x: xCenter, y: yCenter });
  }

  public update(delta: number): Promise<void> {
    return new Promise((resolve) => {
      this.planets.forEach((planetA) => {
        this.planets.forEach((planetB) => {
          if (planetA === planetB) {
            resolve();
          }

          planetA.addForceFrom(planetB);
        });

        planetA.update(delta);
      });
      resolve();
    });
  }
}
