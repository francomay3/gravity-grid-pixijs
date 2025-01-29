import { Container, Rectangle } from "pixi.js";
import { app } from "./main";
import { clamp } from "./utils";

export class Controls {
  public container: Container;
  public isPanning: boolean;
  public scale: number;
  public enabled: boolean;

  constructor(container: Container) {
    this.container = container;
    this.container.eventMode = "static";
    this.container.hitArea = app.screen;
    this.container.cursor = "grab";
    this.isPanning = false;
    this.scale = 1;
    this.enabled = true;

    this.container.on("pointerdown", () => {
      if (!this.enabled) {
        return;
      }

      this.isPanning = true;
      this.container.cursor = "grabbing";
    });

    this.container.on("pointerup", () => {
      if (!this.enabled) {
        return;
      }

      this.isPanning = false;
      this.container.cursor = "grab";
      this.refreshHitArea();
    });

    this.container.on("pointermove", (event) => {
      if (!this.isPanning || !this.enabled) {
        return;
      }

      this.container.x += event.movementX;
      this.container.y += event.movementY;
    });

    this.container.on("wheel", (event) => {
      if (!this.enabled) {
        return;
      }

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

  public disable() {
    this.enabled = false;
  }

  public enable() {
    this.enabled = true;
  }
}
