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

//gsapSetGsapToVariant();
setIntervalVariant();
//initClock();

function initClock() {
  secHand.rotation = (turnSec * Math.PI) / 30;
  minHand.rotation = (turnMin * Math.PI) / 30;
  hourHand.rotation = (turnHours * Math.PI) / 6;
  const tl = gsap.timeline();
  tl.to(secHand, {
    pixi: { rotation: "+=360" },
    duration: 60,
    repeat: -1,
    ease: "linear",
  });
  tl.to(minHand, {
    pixi: { rotation: "+=360" },
    duration: 60 * 60,
    repeat: -1,
    ease: "linear",
  });
  tl.to(hourHand, {
    pixi: { rotation: "+=360" },
    duration: 60 * 60 * 12,
    repeat: -1,
    ease: "linear",
  });
  tl.pause(0);
  tl.seek(0.1);
  tl.play();
}

function gsapSetGsapToVariant() {
  const tl = gsap.timeline({ paused: true });
  const [hours, minutes, sec] = getSecondsMinutesHours();
  const turnSec = sec - 15;
  const turnMin = minutes - 15;
  const turnHours = hours < 12 ? hours - 3 : hours - 15;

  tl.set(secHand, {
    pixi: { rotation: turnSec * 6 },
  });
  tl.set(minHand, {
    pixi: { rotation: turnMin * 6 },
  });
  tl.set(hourHand, {
    pixi: { rotation: turnHours * 30 },
  });

  tl.to(secHand, {
    pixi: { rotation: "+=360" },
    duration: 60,
    repeat: -1,
    ease: "linear",
  });
  tl.to(minHand, {
    pixi: { rotation: "+=360" },
    duration: 60 * 60,
    repeat: -1,
    ease: "linear",
  });
  tl.to(hourHand, {
    pixi: { rotation: "+=360" },
    duration: 60 * 60 * 12,
    repeat: -1,
    ease: "linear",
  });

  setTimeout(() => {
    tl.play();
  }, 0.2);
}

function setIntervalVariant() {
  const tl = gsap.timeline();
  let counter = 0;
  setInterval(() => {
    const [hours, minutes, sec] = getSecondsMinutesHours();
    const turnSec = sec - 15;
    const turnMin = minutes - 15;
    const turnHours = hours < 12 ? hours - 3 : hours - 15;
    
    tl.set(secHand, {
      pixi: { rotation: turnSec * 6 },
    });
    tl.set(minHand, {
      pixi: { rotation: turnMin * 6 },
    });
    tl.set(hourHand, {
      pixi: { rotation: turnHours * 30 },
    });
    if (counter === 0) {
      tl.pause(0.1);
      counter++;
    }
    tl.play(0.1);
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
