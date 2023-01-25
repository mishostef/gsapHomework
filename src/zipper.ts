import * as PIXI from "pixi.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import {
  createGrid,
  createInteractiveBg,
  createTrapezoid,
  createZipper,
} from "./utils";
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
const zipper = createZipper();
app.stage.addChild(zipper);

let indices = [];
bg.on("mousemove", ({ globalX: x, globalY: y }) => handleMouseMove(x, y));

function handleMouseMove(x, y) {
  {
    if (y > CANVAS_HEIGHT) {
      y = CANVAS_HEIGHT;
    }
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
  }
}
function onMouseMovingUp(y: number) {
  const tl = gsap.timeline();
  tl.addLabel("zz", "<");
  left.forEach((zip, i) => {
    if (isClosed(y, zip, i)) {
      processUp(tl, zip, i);
    }
  });
}

function processUp(tl: gsap.core.Timeline, zip: PIXI.Graphics, i: number) {
  const l = tl.to(
    zip,
    {
      pixi: { x: CANVAS_WIDTH / 2, rotation: 0 },
      ease: "none",
    },
    "zz"
  );
  const r = tl.to(
    right[i],
    {
      pixi: { x: CANVAS_WIDTH / 2, rotation: -180 },
      ease: "none",
    },
    "zz"
  );
  const dur = 2 * r.duration();
  indices = indices.filter((index) => index !== i);
  tl.to(
    zipper,
    {
      pixi: { y: (indices.length + 1) * 50 },
      ease: "none",
    },
    "zz+=dur"
  );
}

function onMouseMovingDown(y: number) {
  const tl = gsap.timeline();
  tl.to(zipper, {
    pixi: {
      y,
      ease: "linear",
    },
  });
  tl.addLabel("zz", "<");
  left.forEach((zip, i) => {
    if (isOpened(y, zip, i)) {
      processLeftDown(tl, zip, i);
      indices.push(i);
      processRightDown(tl, i);
    }
  });
}

function processRightDown(tl: gsap.core.Timeline, i: number) {
  const normalizedDeltaY = i * 25 + i * i;
  const rotation = (-45 * i) / (left.length * 2);
  tl.to(
    right[i],
    {
      pixi: {
        x: CANVAS_WIDTH / 2 + normalizedDeltaY,
        rotation: -180 - rotation,
        ease: "linear",
      },
    },
    "zz"
  );
}

function processLeftDown(tl: gsap.core.Timeline, zip: PIXI.Graphics, i) {
  const normalizedDeltaY = i * 25 + i * i;
  const rotation = (-45 * i) / (left.length * 2);
  tl.to(
    zip,
    {
      pixi: {
        x: CANVAS_WIDTH / 2 - normalizedDeltaY,
        rotation,
        ease: "linear",
      },
    },
    "zz"
  );
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
