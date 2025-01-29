import { Application } from "pixi.js";
import { Space } from "./Space";
import { initDevtools } from "@pixi/devtools";
import { Vector2 } from "./vector2";

export const app = new Application();
initDevtools({ app });

(async () => {
  await app.init({ background: "#0d1024", resizeTo: window });
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  const space = new Space({ G: 0.01, planetsDensity: 10000 });
  let isPaused = false;

  space.spawnGalaxy({
    count: 3000,
    minMass: 50000,
    maxMass: 100000,
    center: new Vector2(app.screen.width / 2, app.screen.height / 2),
    radius: 300,
    speed: 1.1, // 1 is orbital stability. greater than 1 and the galaxy will expand, less than 1 and the galaxy will collapse
    temperature: 1, // this adds random velocity to the planets
  });

  app.stage.addChild(space.container);

  const ticker = app.ticker.add(
    (time) => {
      if (!isPaused) {
        space.update(time.deltaTime);
      }
    },
    null,
    1
  );

  ticker.speed = 0.01;

  // Add keyboard event listener
  window.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === "p") {
      isPaused = !isPaused;
      console.log(isPaused ? "Simulation paused" : "Simulation resumed");
    }
  });
})();
