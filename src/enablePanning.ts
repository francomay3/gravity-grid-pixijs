import { Application } from "pixi.js";

export const enablePanning = (app: Application) => {
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;
  let deltaX = 0;
  let deltaY = 0;

  app.stage.on("pointerdown", (event) => {
    isDragging = true;
    lastX = event.globalX;
    lastY = event.globalY;
  });

  app.stage.on("pointermove", (event) => {
    if (isDragging) {
      const currentDeltaX = event.globalX - lastX;
      const currentDeltaY = event.globalY - lastY;

      deltaX = deltaX + currentDeltaX;
      deltaY = deltaY + currentDeltaY;

      lastX = event.globalX;
      lastY = event.globalY;
    }
  });

  app.stage.on("pointerup", () => {
    isDragging = false;
    deltaX = 0;
    deltaY = 0;
  });

  app.ticker.add(
    () => {
      app.stage.x = app.stage.x + deltaX;
      app.stage.y = app.stage.y + deltaY;

      deltaX = 0;
      deltaY = 0;
    },
    null,
    2
  );
};
