import { Container, Rectangle } from "pixi.js";
import { Planet, PlanetOptions } from "../Planet";
import {
  clamp,
  getOrbitalSpeed,
  getRandomVector,
  randomBetween,
} from "../utils";
import { getColor } from "../colorUtils";
import { Vector2 } from "../vector2";
import { update } from "./update";
import { app } from "../main";

interface SpawnGalaxyOptions {
  count: number;
  minMass: number;
  maxMass: number;
  center: Vector2;
  radius: number;
  speed: number;
  temperature: number;
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

  public spawnGalaxy({
    count,
    minMass,
    maxMass,
    center,
    radius,
    speed,
    temperature,
  }: SpawnGalaxyOptions) {
    for (let i = 0; i < count; i++) {
      const planetMass = randomBetween(minMass, maxMass);
      const planetPosition = getRandomVector(radius).add(center);
      const galaxyMass = (minMass + maxMass / 2) * count;
      const speedDueToTemperature = getRandomVector(temperature);
      const planetSpeed = getOrbitalSpeed(
        planetPosition,
        this.G,
        center,
        galaxyMass,
        radius
      )
        .multiply(speed)
        .add(speedDueToTemperature);
      const color = getColor(center, radius, planetPosition);

      this.addPlanet({
        position: planetPosition,
        mass: planetMass,
        density: this.planetsDensity,
        color,
        speed: planetSpeed,
      });
    }
  }

  public destroyPlanet(planet: Planet): void {
    planet.destroy();
    this.planets = this.planets.filter((p) => p !== planet);
  }

  public update(delta: number): void {
    update(this, delta);
  }
}
