import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import {
  CANVAS_COLOR,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  CIRCLE_RADIUS,
  CIRCLE_SCALE_DOWN,
  CIRCLE_SCALE_UP,
  CIRCLE_START_X,
  CIRCLE_START_Y,
  SCALE_DOWN_DURATION,
  SCALE_UP_DURATION,
} from "./constants";
import { createGrid } from "./utils";
gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

const app = new PIXI.Application({
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
  backgroundColor: CANVAS_COLOR,
});

document.body.appendChild(app.view as HTMLCanvasElement);
const circle = createCircle(CIRCLE_START_X, CIRCLE_START_Y, CIRCLE_RADIUS, 0);
const grid = createGrid();
app.stage.addChild(grid);
const circle2 = createCircle(100, 300, CIRCLE_RADIUS, 0x88ff33);

const circle3 = createCircle(100, 500, CIRCLE_RADIUS, 0xff33ed);
const circles = [circle, circle2, circle3];
circles.forEach((x, i) =>//maham go
  setTimeout(() => {
    animate(x);
  }, 100 * i)
);
function animate(circle, ease?: string) {
  gsap.to(circle, {
    pixi: {
      x: 700,
    },
    duration: 2,
    delay: 1,
    ...(ease && { ease }),
  });
  gsap.to(circle, {
    pixi: { scale: 1.5 },
    duration: 1,
    delay: 1,
    ...(ease && { ease }),
  });
  gsap.to(circle, {
    pixi: { scale: 1 },
    duration: 1,
    delay: 2,
    ...(ease && { ease }),
  });
}

function createCircle(x, y, radius, color) {
  const circle = new PIXI.Graphics();
  circle.beginFill(color);
  circle.drawCircle(0, 0, radius);
  circle.endFill();
  app.stage.addChild(circle);

  circle.position.set(x, y);
  return circle;
}
