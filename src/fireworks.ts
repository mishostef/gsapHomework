import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants";
import { createGrid, createBox, createInteractiveBg } from "./utils";
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
const bg = createInteractiveBg();
app.stage.addChild(bg);
bg.on("pointertap", ({ globalX: x, globalY: y }) => {
  const randomColor =
    (((Math.random() * 256) | 0) << 16) +
    (((Math.random() * 256) | 0) << 8) +
    ((Math.random() * 256) | 0);
  const container = firework(x, y, randomColor);
  app.stage.addChild(container);
});

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
    particle(color, container);
  }
  app.stage.addChild(container);
  gsap.to(container, {
    pixi: { y: "-=100" },
    ease: "power2.in",
    duration: 2,
    onComplete: function () {
      container.destroy();
    },
  });
  return container;
}
