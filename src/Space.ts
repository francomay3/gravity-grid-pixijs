import { Graphics } from "pixi.js";
import { Planet } from "./Planet";
import { minMax } from "./utils";

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
