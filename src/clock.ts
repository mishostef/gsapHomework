import { Start, app } from "./gears";
import * as PIXI from "pixi.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);
Start();

const secHand = createHand(300);
const minHand = createHand(200);
const hourHand = createHand(100);

setInterval(() => {
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const sec = date.getSeconds();
  const turnSec = sec - 15;
  const turnMin = minutes - 15;
  const turnHours = hours - 3;
  gsap.set(secHand, {
    pixi: { rotation: turnSec * 6 },
  });
  gsap.set(minHand, {
    pixi: { rotation: turnMin * 6 },
  });
  gsap.set(hourHand, {
    pixi: { rotation: turnHours * 6 },
  });
}, 1000);

function createHand(length) {
  const hand = new PIXI.Graphics();
  hand.beginFill(0);
  hand.drawRect(0, 0, length, 20);
  hand.position.set(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
  hand.pivot.set(0, 10);
  hand.endFill();
  app.stage.addChild(hand);
  return hand;
}
