import * as PIXI from "pixi.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { createInteractiveBg } from "./utils";
const verOffset = 30;

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

bg.on("mousemove", ({ globalX: x, globalY: y }) => {
  console.log(`current x is ${x},     current y is ${y}`);
  left.forEach((zip) => {
    if (y >= zip.y - 50 && y <= zip.y + 50) {
      zip.x -= 100;
    }
  });
});

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
