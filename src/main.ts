import { Application } from "pixi.js";
import { Space } from "./Space";
import { initDevtools } from "@pixi/devtools";

export const app = new Application();
initDevtools({ app });

(async () => {
  await app.init({ background: "#0d1024", resizeTo: window });
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  const space = new Space({ G: 0.0001, planetsDensity: 10000 });

  space.addRandomPlanets({
    count: 500,
    minMass: 50000,
    maxMass: 100000,
    maxKineticEnergy: 10000,
    area: {
      minX: 0,
      minY: 0,
      maxX: app.screen.width,
      maxY: app.screen.height,
    },
    bias: 3,
  });

  app.stage.addChild(space.container);

  app.ticker.add((time) => space.update(time.deltaTime), null, 1);
})();
