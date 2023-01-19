import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants";
import { createGrid } from "./utils";
import { Sprite, Texture } from "pixi.js";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export const app = new PIXI.Application({
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
  backgroundColor: 0xaaaaaa,
});

document.body.appendChild(app.view as HTMLCanvasElement);
const grid = createGrid();
app.stage.addChild(grid);
let anims;
Start();
export function Start() {
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
  ]).then((textures) => {
    console.log(textures);
    anims = anim(textures);
    const gearTextures = [
      textures[6],
      textures[8],
      textures[9],
      textures[10],
      textures[11],
    ];
    setControls(gearTextures);
  });
}

function setControls(gearTextures) {
  const [gearBox, fast, faster, normal, paused] = gearTextures.map(
    (texture) => {
      const sprite = PIXI.Sprite.from(texture);
      sprite.anchor.set(0.5, 0.5);
      app.stage.addChild(sprite);
      return sprite;
    }
  );
  console.log(gearBox);
  gearBox.position.set(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
  const width = fast.getBounds().width;
  paused.position.set(CANVAS_WIDTH / 2 - 1.65 * width, CANVAS_HEIGHT / 2);
  normal.position.set(CANVAS_WIDTH / 2 - 0.55 * width, CANVAS_HEIGHT / 2);
  fast.position.set(CANVAS_WIDTH / 2 + 0.55 * width, CANVAS_HEIGHT / 2);
  faster.position.set(CANVAS_WIDTH / 2 + 1.65 * width, CANVAS_HEIGHT / 2);
  makeInteractive([normal, paused, fast, faster]);
}

function makeInteractive(buttons) {
  const [normal, paused, fast, faster] = buttons;
  buttons.forEach((btn) => (btn.interactive = true));
  paused.on("pointertap", () => {
    anims.forEach((anim) => anim.pause());
  });
  normal.on("pointertap", () => {
    anims.forEach((anim) => anim.play());
  });
  fast.on("pointertap", () => {
    anims.forEach((anim) => anim.timeScale(2));
  });
  faster.on("pointertap", () => {
    anims.forEach((anim) => anim.timeScale(4));
  });
}

function anim(
  x: [
    Texture,
    Texture,
    Texture,
    Texture,
    Texture,
    Texture,
    Texture,
    Texture,
    Texture,
    Texture,
    Texture,
    Texture
  ]
) {
  const gear40 = PIXI.Sprite.from(x[5]);
  const anim40 = spawnGear(gear40, { x: 400, y: 300 }, "+", 20);
  const gear12 = PIXI.Sprite.from(x[0]);
  const anim12 = spawnGear(gear12, { x: 300, y: 117 }, "-", 6);
  const gear28 = PIXI.Sprite.from(x[4]);
  const anim28 = spawnGear(gear28, { x: 142, y: 130 }, "+", 14);
  const gear16 = PIXI.Sprite.from(x[1]);
  const anim16 = spawnGear(gear16, { x: 542, y: 471 }, "-", 8);
  const gear24 = PIXI.Sprite.from(x[3]);
  const anim24 = spawnGear(gear24, { x: 676, y: 388 }, "+", 12);
  const gear20 = PIXI.Sprite.from(x[2]);
  const anim20 = spawnGear(gear20, { x: 212, y: 441 }, "-", 10);

  return [anim40, anim12, anim28, anim16, anim24, anim20];
}

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
  return gsap.to(sprite, {
    pixi: { rotation },
    duration,
    repeat: -1,
    ease: "linear",
  });
}
