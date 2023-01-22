import * as PIXI from "pixi.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { createGrid, createInteractiveBg, createTrapezoid } from "./utils";
const verOffset = 30;
const zipDist = 15;
let mouseLastY = CANVAS_HEIGHT;

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

const app = new PIXI.Application({
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
  backgroundColor: 0,
});
document.body.appendChild(app.view as HTMLCanvasElement);

const bg = createInteractiveBg();
app.stage.addChild(bg);

const grid = createGrid();
app.stage.addChild(grid);

const [left, right] = getTrapezoids();
let indices = [];
bg.on("mousemove", ({ globalX: x, globalY: y }) => {
  if (y > CANVAS_HEIGHT) {
    y = CANVAS_HEIGHT;
  }
  console.log(`current x is ${x},     current y is ${y}`);
  let direction = "none";
  if (y < mouseLastY) {
    direction = "up";
  } else if (y > mouseLastY) {
    direction = "down";
  }
  mouseLastY = y;
  if (direction === "down") {
    onMouseMovingDown(y);
  } else if (direction === "up") {
    onMouseMovingUp(y);
  }
});

function onMouseMovingUp(y: number) {
  left.forEach((zip, i) => {
    if (isClosed(y, zip, i)) {
      gsap.to(zip, {
        pixi: { x: CANVAS_WIDTH / 2, rotation: 0 },
        ease: "none",
      });
      gsap.to(right[i], {
        pixi: { x: CANVAS_WIDTH / 2, rotation: -180 },
        ease: "none",
      });
      indices = indices.filter((index) => index !== i);
    }
  });
}

function onMouseMovingDown(y: number) {
  left.forEach((zip, i) => {
    const normalizedDeltaY = i * 25 + i * i;
    const rotation = (-45 * i) / (left.length * 2);
    if (isOpened(y, zip, i)) {
      gsap.to(zip, {
        pixi: {
          x: CANVAS_WIDTH / 2 - normalizedDeltaY,
          rotation,
        },
        ease: "none",
      });
      indices.push(i);

      gsap.to(right[i], {
        pixi: {
          x: CANVAS_WIDTH / 2 + normalizedDeltaY,
          rotation: -180 - rotation,
        },
        ease: "none",
      });
    }
  });
}

function isClosed(y: number, zip: PIXI.Graphics, i: number) {
  return y <= zip.y + zipDist && indices.includes(i);
}

function isOpened(y: number, zip: PIXI.Graphics, i: number) {
  return y >= zip.y - zipDist && !indices.includes(i);
}

function getTrapezoids() {
  const left: PIXI.Graphics[] = [];
  const right: PIXI.Graphics[] = [];
  for (let i = 0; i < 10; i++) {
    const vertStep = 55;
    const trapezoidLeft = createTrapezoid(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT - verOffset - vertStep * i,
      0xbbbbbb
    );
    const trapezoidRight = createTrapezoid(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT - verOffset - vertStep * i - vertStep / 2,
      0xccc777
    );
    trapezoidRight.rotation = Math.PI;
    left.push(trapezoidLeft);
    right.push(trapezoidRight);
    app.stage.addChild(trapezoidLeft);
    app.stage.addChild(trapezoidRight);
  }
  return [left, right];
}
