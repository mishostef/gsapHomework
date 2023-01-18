import * as PIXI from "pixi.js";
export function createGrid() {
  const grid = new PIXI.Graphics();
  grid.lineStyle({ color: 0xffffff, width: 1, alpha: 0.2 });
  for (let x = 0; x < 800; x += 50) {
    if ((x - 50) % 200 == 0) {
      grid.line.alpha = 0.5;
    } else {
      grid.line.alpha = 0.2;
    }
    grid.moveTo(x, 0);
    grid.lineTo(x, 600);
  }
  for (let y = 0; y < 600; y += 50) {
    if ((y - 50) % 200 == 0) {
      grid.line.alpha = 0.5;
    } else {
      grid.line.alpha = 0.2;
    }
    grid.moveTo(0, y);
    grid.lineTo(800, y);
  }
  return grid;
}
export function createBox(
  x: number,
  y: number,
  color = 0xffffff,
  width = 100,
  height = 100
) {
  const box = new PIXI.Graphics();
  box.beginFill(color);
  box.drawRect(0, 0, width, height);
  box.endFill();
  box.position.set(x, y);
  box.pivot.set(width / 2, height / 2);
  return box;
}
