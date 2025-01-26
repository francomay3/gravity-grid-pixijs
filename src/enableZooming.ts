import { Application } from "pixi.js";

export const enableZooming = (app: Application) => {
  let scale = 1;

  app.view.addEventListener("wheel", (event) => {
    event.preventDefault();

    const mouseX = event.clientX - app.view.offsetLeft;
    const mouseY = event.clientY - app.view.offsetTop;

    const worldPos = {
      x: (mouseX - app.stage.x) / app.stage.scale.x,
      y: (mouseY - app.stage.y) / app.stage.scale.y,
    };

    const zoomFactor = event.deltaY > 0 ? 0.95 : 1.05;
    const newScale = scale * zoomFactor;

    if (newScale > 0.1 && newScale < 5) {
      scale = newScale;
      app.stage.scale.set(scale);

      app.stage.x = mouseX - worldPos.x * scale;
      app.stage.y = mouseY - worldPos.y * scale;
    }
  });
};
