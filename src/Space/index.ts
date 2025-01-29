import { Container } from "pixi.js";
import { Planet, PlanetOptions } from "../Planet";
import { update } from "./update";
import { spawnGalaxy, SpawnGalaxyOptions } from "./spawnGalaxy";
import { Controls } from "../Controls";

interface SpaceOptions {
  G: number;
  planetsDensity: number;
}

export class Space {
  public planets: Planet[];
  public G: number;
  public planetsDensity: number;
  public container: Container;
  public controls: Controls;

  constructor({ G, planetsDensity }: SpaceOptions) {
    this.planets = [];
    this.G = G;
    this.planetsDensity = planetsDensity;
    this.container = new Container();
    this.controls = new Controls(this.container);
  }

  public addPlanet(options: PlanetOptions) {
    const planet = new Planet(options);
    this.planets.push(planet);
    this.container.addChild(planet.container);
  }

  public spawnGalaxy(options: SpawnGalaxyOptions) {
    spawnGalaxy(this, options);
  }

  public destroyPlanet(planet: Planet): void {
    planet.destroy();
    this.planets = this.planets.filter((p) => p !== planet);
  }

  public update(delta: number): void {
    update(this, delta);
  }
}
