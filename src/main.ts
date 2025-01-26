import { Application } from "pixi.js";
import { Space } from "./Space";
import { initDevtools } from "@pixi/devtools";
import { enablePanning } from "./enablePanning";
import { enableZooming } from "./enableZooming";
import { enableScreenEvents } from "./enableScreenEvents";

export const app = new Application();
initDevtools({ app });

(async () => {
  await app.init({ background: "#0d1024", resizeTo: window });
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  const space = new Space({ G: 0.001, planetsDensity: 100 });

  space.addRandomPlanets({
    count: 500,
    minMass: 500,
    maxMass: 1000,
    maxKineticEnergy: 5000,
    area: {
      minX: 0,
      minY: 0,
      maxX: app.screen.width,
      maxY: app.screen.height,
    },
    bias: 100,
    color: 0xff0000,
  });
  space.addRandomPlanets({
    count: 500,
    minMass: 500,
    maxMass: 1000,
    maxKineticEnergy: 5000,
    area: {
      minX: 0,
      minY: 0,
      maxX: app.screen.width,
      maxY: app.screen.height,
    },
    bias: 1000,
    color: 0x00ff00,
  });

  space.addRandomPlanets({
    count: 500,
    minMass: 600,
    maxMass: 2000,
    maxKineticEnergy: 5000,
    area: {
      minX: 0,
      minY: 0,
      maxX: app.screen.width,
      maxY: app.screen.height,
    },
    bias: 500,
    color: 0x0000ff,
  });

  enableScreenEvents(app);
  enablePanning(app);
  enableZooming(app);

  const graphics = space.getSprites();

  app.stage.addChild(...graphics);

  app.ticker.add((time) => space.update(time.deltaTime), null, 1);
})();
