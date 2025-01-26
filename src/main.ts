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

  const space = new Space({ G: 0.01, planetsDensity: 1 });

  space.addRandomPlanets({
    count: 100,
    minMass: 0,
    maxMass: 1000,
    maxKineticEnergy: 5000,
    area: { minX: 0, minY: 0, maxX: 1000, maxY: 1000 },
  });

  enableScreenEvents(app);
  enablePanning(app);
  enableZooming(app);

  const graphics = space.getSprites();

  app.stage.addChild(...graphics);

  app.ticker.add((time) => space.update(time.deltaTime), null, 1);
})();
