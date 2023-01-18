import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { CANVAS_COLOR, CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants";
import { createGrid, createBox } from "./utils";
import { Sprite } from "pixi.js";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

const app = new PIXI.Application({
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
  backgroundColor: 0xaaaaaa,
});

document.body.appendChild(app.view as HTMLCanvasElement);
const grid = createGrid();
app.stage.addChild(grid);

Promise.all([
  PIXI.Assets.load("../assets/gear12.png"),
  PIXI.Assets.load("../assets/gear16.png"),
  PIXI.Assets.load("../assets/gear20.png"),
  PIXI.Assets.load("../assets/gear24.png"),
  PIXI.Assets.load("../assets/gear28.png"),
  PIXI.Assets.load("../assets/gear40.png"),
  PIXI.Assets.load("../assets/gearbox.png"),
  PIXI.Assets.load("../assets/gears.png"),
  PIXI.Assets.load("../assets/speed-fast.png"),
  PIXI.Assets.load("../assets/speed-faster.png"),
  PIXI.Assets.load("../assets/speed-normal.png"),
  PIXI.Assets.load("../assets/speed-paused.png"),
]).then((x) => {
  const gear40 = PIXI.Sprite.from(x[5]);
  spawnGear(gear40, { x: 400, y: 300 }, "+", 20);
  const gear12 = PIXI.Sprite.from(x[0]);
  spawnGear(gear12, { x: 300, y: 117 }, "-", 6);
  const gear28 = PIXI.Sprite.from(x[4]);
  spawnGear(gear28, { x: 142, y: 130 }, "+", 14);
  const gear16 = PIXI.Sprite.from(x[1]);
  spawnGear(gear16, { x: 542, y: 471 }, "+", 8);
  const gear24 = PIXI.Sprite.from(x[3]);
  spawnGear(gear24, { x: 676, y: 388 }, "+", 12);
  const gear20 = PIXI.Sprite.from(x[2]);
  spawnGear(gear20, { x: 212, y: 441 }, "-", 10);
});
function spawnGear(
  sprite: Sprite,
  position: { x: number; y: number },
  direction: string,
  duration: number
) {
  const d = sprite.getBounds().width;
  console.log(d);
  sprite.position.set(position.x, position.y);
  sprite.anchor.set(0.5, 0.5);
  app.stage.addChild(sprite);
  const rotation = direction === "+" ? 360 : -360;
  gsap.to(sprite, { pixi: { rotation }, duration, repeat: -1 });
}
