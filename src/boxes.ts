import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { CANVAS_COLOR, CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants";
import { createBox, createGrid } from "./utils";
gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

const app = new PIXI.Application({
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
  backgroundColor: CANVAS_COLOR,
});

document.body.appendChild(app.view as HTMLCanvasElement);
const bg = new PIXI.Graphics();
bg.beginFill(CANVAS_COLOR);
bg.drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
bg.endFill();
app.stage.addChild(bg);

const grid = createGrid();
app.stage.addChild(grid);

const first = createBox(100, 300);
const second = createBox(300, 300);
const third = createBox(500, 300);
const fourth = createBox(700, 300);
const squares = [first, second, third, fourth];
squares.forEach((el) => {
  app.stage.addChild(el);
  el.interactive = true;
});
const rotate = gsap.to(first, { pixi: { rotation: 360 } });
const blur = gsap.to(second, { pixi: { blur: 10 } });
const skew = gsap.to(third, { pixi: { skewX: "50" }, duration: 2 });
const tint = gsap.to(fourth, {
  pixi: { tint: 0xff0000 },
  duration: 2,
});

[rotate, blur, skew, tint].forEach((anim, i) => {
  anim.pause();
  let clickedOnce = false;
  squares[i].on("pointertap", () => {
    clickedOnce = !clickedOnce;
    if (clickedOnce) {
      anim.play();
    } else {
      anim.reverse();
    }
  });
});
