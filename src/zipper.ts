import * as PIXI from "pixi.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { createInteractiveBg } from "./utils";
const verOffset = 30;
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

const [left, right] = getTrapezoids();
let indicesLeft = [];
let indicesRight = [];
bg.on("mousemove", ({ globalX: x, globalY: y }) => {
  console.log(`current x is ${x},     current y is ${y}`);
  let direction = "down";
  if (y < mouseLastY) {
    direction = "up";
  }
  mouseLastY = y;
  if (direction === "down") {
    left.forEach((zip, i) => {
      if (isLeftOpened(y, zip, i)) {
        zip.x -= 20;
        indicesLeft.push(i);
      }
    });
    right.forEach((zip, i) => {
      if (isRightOpened(y, zip, i)) {
        zip.x += 20;
        indicesRight.push(i);
      }
    });
  } else {
    left.forEach((zip, i) => {
      if (isLeftClosed(y, zip, i)) {
        zip.x += 20;
        indicesLeft = indicesLeft.filter((index) => index !== i);
      }
    });
    right.forEach((zip, i) => {
      if (isRightClosed(y, zip, i)) {
        zip.x -= 20;
        indicesRight = indicesRight.filter((index) => index !== i);
      }
    });
  }
});

function isRightClosed(y: number, zip: PIXI.Graphics, i: number) {
  return y >= zip.y - 20 && y <= zip.y + 20 && indicesRight.includes(i);
}

function isLeftClosed(y: number, zip: PIXI.Graphics, i: number) {
  return y >= zip.y - 20 && y <= zip.y + 20 && indicesLeft.includes(i);
}

function isLeftOpened(y: number, zip: PIXI.Graphics, i: number) {
  return y >= zip.y - 20 && y <= zip.y + 20 && !indicesLeft.includes(i);
}

function isRightOpened(y: number, zip: PIXI.Graphics, i: number) {
  return y >= zip.y - 20 && y <= zip.y + 20 && !indicesRight.includes(i);
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
  trapezoid.endFill();
  return trapezoid;
}
