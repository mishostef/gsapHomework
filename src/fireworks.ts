import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { CANVAS_COLOR, CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants";
import { createGrid, createBox } from "./utils";
gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

const app = new PIXI.Application({
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
  backgroundColor: 0,
});

document.body.appendChild(app.view as HTMLCanvasElement);
const grid = createGrid();
app.stage.addChild(grid);

const container = firework(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 0); //new PIXI.Container();
// particle(0xabcd7777, container);
app.stage.addChild(container);

function particle(color: number, parent: PIXI.Container) {
  const startX = 0;
  const startY = 0;
  const whiteRect = createBox(startX, startY, 0xffffff, 4, 4);
  app.stage.addChild(whiteRect);
  gsap.fromTo(
    whiteRect,
    { pixi: { scale: 0 } },
    {
      pixi: {
        x: "random(-100,100)",
        y: "random(-100,100)",
        rotation: 1440,
        scale: 2,
        blur: 1,
      },
      duration: 2,
    }
  );
  gsap.to(whiteRect, { pixi: { tint: color }, duration: 1 });
  gsap.to(whiteRect, { pixi: { tint: 0 }, duration: 1, delay: 1 });
  parent.addChild(whiteRect);
  return parent;
}

function firework(x: number, y: number, color: number) {
  const container = new PIXI.Container();
  container.position.set(x, y);

  for (let i = 0; i < 100; i++) {
    particle(0xffffff, container);
  }
  app.stage.addChild(container);
  return container;
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
