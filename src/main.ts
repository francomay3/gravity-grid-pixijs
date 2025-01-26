import { Application } from "pixi.js";
import { Space } from "./Space";

export const app = new Application();

(async () => {
  await app.init({ background: "#0d1024", resizeTo: window });
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  const space = new Space({
    numberOfPlanets: 100,
    maxSpeed: 1,
    maxMass: 0.01,
  });

  const graphics = space.getSprites();

  app.stage.addChild(...graphics);

  app.ticker.add((time) => {
    space.update(time.deltaTime);
  });
})();
