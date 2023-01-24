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
import { createCircle, createGrid } from "./utils";
gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

const app = new PIXI.Application({
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
  backgroundColor: CANVAS_COLOR,
});

document.body.appendChild(app.view as HTMLCanvasElement);

const grid = createGrid();
app.stage.addChild(grid);
const circle = createCircle(CIRCLE_START_X, CIRCLE_START_Y, CIRCLE_RADIUS, 0);
app.stage.addChild(circle);
const circle2 = createCircle(100, 300, CIRCLE_RADIUS, 0x88ff33);
app.stage.addChild(circle2);
const circle3 = createCircle(100, 500, CIRCLE_RADIUS, 0xff33ed);
app.stage.addChild(circle3);

const tl = gsap.timeline();
animate(circle);
animate(circle2, "linear", "elastic");
animate(circle3, "sine", "bounce");

function animate(circle, movementEase?: string, scalingEase?: string) {
  tl.to(
    circle,
    {
      pixi: {
        x: 700,
      },
      duration: 2,
      ...(movementEase && { ease: movementEase }),
    },
    1
  );
  tl.to(
    circle,
    {
      pixi: { scale: CIRCLE_SCALE_UP },
      duration: SCALE_UP_DURATION,
      ...(scalingEase && { ease: scalingEase + ".out" }),
    },
    1
  );
  tl.to(
    circle,
    {
      pixi: { scale: CIRCLE_SCALE_DOWN },
      duration: SCALE_DOWN_DURATION,
      ...(scalingEase && { ease: scalingEase + ".in" }),
    },
    2
  );
}
