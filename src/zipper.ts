import * as PIXI from "pixi.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { createGrid, createInteractiveBg } from "./utils";
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
let indicesLeft = [];
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
    if (isLeftClosed(y, zip, i)) {
      gsap.to(zip, { pixi: { x: CANVAS_WIDTH / 2, rotation: 0 } });
      console.log(right[i].pivot);
      gsap.to(right[i], { pixi: { x: CANVAS_WIDTH / 2, rotation: -180 } });
      indicesLeft = indicesLeft.filter((index) => index !== i);
    }
  });
}

function onMouseMovingDown(y: number) {
  left.forEach((zip, i) => {
    const normalizedDeltaY = i * 15;
    if (isLeftOpened(y, zip, i)) {
      gsap.to(zip, {
        pixi: {
          x: CANVAS_WIDTH / 2 - normalizedDeltaY,
          rotation: (-45 * i) / left.length / 2,
        },
      });
      indicesLeft.push(i);

      gsap.to(right[i], {
        pixi: {
          x: CANVAS_WIDTH / 2 + normalizedDeltaY,
          rotation: -180 - (-45 * i) / left.length / 2,
        },
      });
    }
  });
}

function isLeftClosed(y: number, zip: PIXI.Graphics, i: number) {
  return (
    y >= zip.y - zipDist && y <= zip.y + zipDist && indicesLeft.includes(i)
  );
}

function isLeftOpened(y: number, zip: PIXI.Graphics, i: number) {
  return (
    y >= zip.y - zipDist && y <= zip.y + zipDist && !indicesLeft.includes(i)
  );
}

function getTrapezoids() {
  const left: PIXI.Graphics[] = [];
  const right: PIXI.Graphics[] = [];
  for (let i = 0; i < 10; i++) {
    const vertStep = 55;
    const trapezoidLeft = drawTrapezoid(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT - verOffset - vertStep * i,
      0xbbbbbb
    );
    const trapezoidRight = drawTrapezoid(
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

function drawTrapezoid(x, y, color) {
  const trapezoid = new PIXI.Graphics();
  trapezoid.beginFill(color);
  trapezoid.drawPolygon(-10, -15, 10, -5, 10, 5, -10, 15);
  trapezoid.position.set(x, y);
  trapezoid.pivot.set(0, 0);
  trapezoid.endFill();
  return trapezoid;
}
