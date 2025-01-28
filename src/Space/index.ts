import { Graphics } from "pixi.js";
import { Planet, PlanetOptions } from "../Planet";
import { randomBetween } from "../utils";
import { getColor } from "../colorUtils";
import { Coordinates } from "../Coordinates";
import { update } from "./update";

interface AddRandomPlanetsOptions {
  count: number;
  minMass: number;
  maxMass: number;
  maxKineticEnergy: number;
  area: { minX: number; minY: number; maxX: number; maxY: number };
  bias: number;
}

interface SpaceOptions {
  G: number;
  planetsDensity: number;
}

export class Space {
  public planets: Planet[];
  public G: number;
  public planetsDensity: number;

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
  }: AddRandomPlanetsOptions) {
    const center = new Coordinates(area.maxX / 2, area.maxY / 2);
    for (let i = 0; i < count; i++) {
      const mass = randomBetween(minMass, maxMass);
      const kineticEnergy = randomBetween(0, maxKineticEnergy);
      const position = new Coordinates(
        randomBetween(area.minX, area.maxX),
        randomBetween(area.minY, area.maxY)
      );
      const color = getColor(area, position);

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

  public getCenterOfMass(): Coordinates {
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

    return new Coordinates(xCenter, yCenter);
  }

  public update(delta: number): void {
    update(this, delta);
  }

  public calculateGravitationalForce(
    planetA: Planet,
    planetB: Planet,
    distance: number
  ) {
    const forceMagnitude =
      this.G *
      ((planetA.getMass() * planetB.getMass()) / (distance * distance));

    const dx = planetB.getPosition().x - planetA.getPosition().x;
    const dy = planetB.getPosition().y - planetA.getPosition().y;

    return new Coordinates(
      forceMagnitude * (dx / distance),
      forceMagnitude * (dy / distance)
    );
  }
}
