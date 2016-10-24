export default class Circle {
  constructor(ctx) {
     this.ctx = ctx;
     this.x = 0;
     this.y = 0;
     this.radius = 6;
     this.color = "rgb(255, 73, 22)";
  }

  draw() {
    this.ctx.globalCompositeOperation = "lighter";
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    this.ctx.closePath();
  }
}
