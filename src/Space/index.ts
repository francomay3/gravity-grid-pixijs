import { Container, Rectangle } from "pixi.js";
import { Planet, PlanetOptions } from "../Planet";
import { clamp, randomBetween } from "../utils";
import { getColor } from "../colorUtils";
import { Coordinates } from "../Coordinates";
import { update } from "./update";
import { app } from "../main";

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
  public container: Container;
  public isPanning: boolean = false;
  public scale: number = 1;

  constructor({ G, planetsDensity }: SpaceOptions) {
    this.planets = [];
    this.G = G;
    this.planetsDensity = planetsDensity;
    this.container = new Container();

    this.container.eventMode = "static";
    this.container.hitArea = app.screen;
    this.container.cursor = "grab";

    this.container.on("pointerdown", () => {
      this.isPanning = true;
      this.container.cursor = "grabbing";
    });

    this.container.on("pointerup", () => {
      this.isPanning = false;
      this.container.cursor = "grab";
      this.refreshHitArea();
    });

    this.container.on("pointermove", (event) => {
      if (this.isPanning) {
        this.container.x += event.movementX;
        this.container.y += event.movementY;
      }
    });

    this.container.on("wheel", (event) => {
      event.preventDefault();

      const zoomFactor = event.deltaY > 0 ? 0.95 : 1.05;
      const newScale = clamp(this.scale * zoomFactor, 0.1, 5);

      if (newScale === this.scale) {
        return;
      }

      const mouseX = event.clientX - app.view.offsetLeft;
      const mouseY = event.clientY - app.view.offsetTop;

      const worldPos = {
        x: (mouseX - this.container.x) / this.container.scale.x,
        y: (mouseY - this.container.y) / this.container.scale.y,
      };

      this.scale = newScale;
      this.container.scale.set(this.scale);

      this.container.x = mouseX - worldPos.x * this.scale;
      this.container.y = mouseY - worldPos.y * this.scale;

      this.refreshHitArea();
    });
  }

  private refreshHitArea() {
    const bounds = new Rectangle(
      -this.container.x / this.scale,
      -this.container.y / this.scale,
      app.screen.width / this.scale,
      app.screen.height / this.scale
    );
    this.container.hitArea = bounds;
  }

  public addPlanet(options: PlanetOptions) {
    const planet = new Planet(options);
    this.planets.push(planet);
    this.container.addChild(planet.container);
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
}
