import { Start, app } from "./gears";
import * as PIXI from "pixi.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";

document.body.appendChild(app.view as HTMLCanvasElement);
gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

const secHand = createHand(300);
const minHand = createHand(200);
const hourHand = createHand(100);
const [hours, minutes, sec] = getSecondsMinutesHours();
console.log(`${hours}:${minutes}:${sec}`);
const turnSec = sec - 15;
const turnMin = minutes - 15;
const turnHours = hours > 12 ? hours - 3 : hours - 15;

setIntervalVariant();
//initClock();
function initClock() {
  secHand.rotation = (turnSec * Math.PI) / 30;
  minHand.rotation = (turnMin * Math.PI) / 30;
  hourHand.rotation = (turnHours * Math.PI) / 6;
  gsap.to(secHand, {
    pixi: { rotation: 360 },
    duration: 60,
    repeat: -1,
    ease: "linear",
  });
  gsap.to(minHand, {
    pixi: { rotation: 360 },
    duration: 60 * 60,
    repeat: -1,
    ease: "linear",
  });
  gsap.to(hourHand, {
    pixi: { rotation: 360 },
    duration: 60 * 60 * 12,
    repeat: -1,
    ease: "linear",
  });
}
function setIntervalVariant() {
  setInterval(() => {
    const [hours, minutes, sec] = getSecondsMinutesHours();
    const turnSec = sec - 15;
    const turnMin = minutes - 15;
    const turnHours = hours < 12 ? hours - 3 : hours - 15;
    gsap.set(secHand, {
      pixi: { rotation: turnSec * 6 },
    });
    gsap.set(minHand, {
      pixi: { rotation: turnMin * 6 },
    });
    gsap.set(hourHand, {
      pixi: { rotation: turnHours * 30 },
    });
  }, 1000);
}

function getSecondsMinutesHours() {
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const sec = date.getSeconds();
  return [hours, minutes, sec];
}
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
