import { Application, Rectangle } from "pixi.js";

export const enableScreenEvents = (app: Application) => {
  const stageHitArea = new Rectangle(0, 0, app.screen.width, app.screen.height);
  app.stage.eventMode = "static";
  app.stage.hitArea = stageHitArea;

  app.ticker.add(
    () => {
      stageHitArea.width = app.screen.width / app.stage.scale.x;
      stageHitArea.height = app.screen.height / app.stage.scale.y;
      stageHitArea.x = -app.stage.x;
      stageHitArea.y = -app.stage.y;
    },
    null,
    3
  );
};
