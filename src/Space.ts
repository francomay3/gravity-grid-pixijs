import { Graphics } from "pixi.js";
import { Planet, PlanetOptions } from "./Planet";
import { Position } from "./Position";
import { randomBetween } from "./utils";

interface AddRandomPlanetsOptions {
  count: number;
  minMass: number;
  maxMass: number;
  maxKineticEnergy: number;
  area: { minX: number; minY: number; maxX: number; maxY: number };
  bias: number;
  color: number;
}

interface SpaceOptions {
  G: number;
  planetsDensity: number;
}

export class Space {
  private planets: Planet[];
  private G: number;
  private planetsDensity: number;

  constructor({ G, planetsDensity }: SpaceOptions) {
    this.planets = [];
    this.G = G;
    this.planetsDensity = planetsDensity;
  }

  public addPlanet(options: PlanetOptions) {
    const planet = new Planet(options);
    this.planets.push(planet);
  }

  public addRandomPlanets({
    count,
    minMass,
    maxMass,
    maxKineticEnergy,
    area,
    bias,
    color,
  }: AddRandomPlanetsOptions) {
    const center = new Position({
      x: area.maxX / 2,
      y: area.maxY / 2,
    });
    for (let i = 0; i < count; i++) {
      const mass = randomBetween(minMass, maxMass);
      const kineticEnergy = randomBetween(0, maxKineticEnergy);
      const position = {
        x: randomBetween(area.minX, area.maxX),
        y: randomBetween(area.minY, area.maxY),
      };
      this.addPlanet({
        mass,
        kineticEnergy,
        position,
        density: this.planetsDensity,
        bias,
        center,
        color,
      });
    }
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

  public update(delta: number): void {
    this.planets.forEach((planetA) => {
      this.planets.forEach((planetB) => {
        if (planetA === planetB) return;

        planetA.addForceFrom(planetB, this.G);
      });
    });

    this.planets.forEach((planet) => {
      if (planet.willDestroy) {
        this.destroyPlanet(planet);
      } else {
        planet.update(delta);
      }
    });
  }
}
