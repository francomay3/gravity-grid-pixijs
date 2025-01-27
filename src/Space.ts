import { Graphics } from "pixi.js";
import { Planet, PlanetOptions } from "./Planet";
import { Position } from "./Position";
import {
  getColor,
  getColorAfterColission,
  getPositionAfterCollission,
  getSpeedAfterCollission,
  randomBetween,
} from "./utils";
import { Force } from "./Force";

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
    for (let i = 0; i < this.planets.length; i++) {
      const planetA = this.planets[i];
      for (let j = i + 1; j < this.planets.length; j++) {
        const planetB = this.planets[j];
        if (planetB.willDestroy || planetA.willDestroy) {
          continue;
        }
        const distance = planetA.position.distance(planetB.getPosition());

        if (distance < planetA.radius + planetB.radius) {
          planetA.willDestroy = true;
          const newMass = planetA.mass + planetB.mass;
          const newSpeed = getSpeedAfterCollission(planetA, planetB);
          const newPosition = getPositionAfterCollission(planetA, planetB);
          const newColor = getColorAfterColission(
            planetA.color,
            planetA.mass,
            planetB.color,
            planetB.mass
          );
          planetB.setSpeed(newSpeed);
          planetB.setMass(newMass);
          planetB.setPosition(newPosition);
          planetB.setColor(newColor);
          planetB.redraw();
          continue;
        }

        const force = this.calculateGravitationalForce(
          planetA,
          planetB,
          distance
        );

        planetA.addForce(force);
        planetB.addForce(force.inverse());
      }
    }

    this.planets.forEach((planet) => {
      if (planet.willDestroy) {
        this.destroyPlanet(planet);
      } else {
        planet.update(delta);
      }
    });
  }

  private calculateGravitationalForce(
    planetA: Planet,
    planetB: Planet,
    distance: number
  ) {
    const forceMagnitude =
      this.G *
      ((planetA.getMass() * planetB.getMass()) / (distance * distance));

    // Calculate direction vector
    const dx = planetB.getPosition().x - planetA.getPosition().x;
    const dy = planetB.getPosition().y - planetA.getPosition().y;

    // Return force vector
    return new Force({
      x: forceMagnitude * (dx / distance),
      y: forceMagnitude * (dy / distance),
    });
  }
}
