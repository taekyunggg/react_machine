import Board from './board';
import FxParams from '../fxParams';

class SnakeView {
  constructor(fxContext) {
    this.$el = $('.snake-container');
    this.board = new Board(20);
    this.keys = {
      38: "N",
      39: "E",
      40: "S",
      37: "W"
    };
    this.setupGrid();

    this.intervalId = window.setInterval(
      this.step.bind(this),
      100
    );
    this.fxContext = fxContext;
    this.x = 0;
    this.y = 0;

    $(window).on("keydown", this.handleKeyEvent.bind(this));
  }

  handleKeyEvent(e) {
    if (this.keys[e.keyCode]) {
      this.board.snake.turn(this.keys[e.keyCode]);
    }
  }

  updateClasses(coords, className) {
    this.$li.filter(`.${className}`).removeClass();

    coords.forEach(coord => {
      const flatCoord = (coord.i * this.board.dim) + coord.j;
      this.$li.eq(flatCoord).addClass(className);
    });
  }

  setupGrid() {
    this.$li = this.$el.find("li");
  }

  step() {
    if (this.board.snake.segments.length > 0) {
      this.board.snake.move();
      this.render();
      this.x = this.board.snake.head().j * 10;
      this.y = this.board.snake.head().i * 10;
      if (this.x < 0) {
        this.x = 0;
      }
      if (this.y < 0) {
        this.y = 0;
      }
      if (this.fxContext.fx1 === this.fxContext.lpFilter) {
        this.fxContext.fx1[FxParams['lpFilter']].value = Math.pow(10, (this.y / 46.057239172)) + 500;
      } else if (this.fxContext.fx1 === this.fxContext.hpFilter) {
        this.fxContext.fx1[FxParams['hpFilter']].value = Math.pow(10, (this.y / 46.057239172));
      }
      if (this.fxContext.fx2 === this.fxContext.reverb) {
        this.fxContext.fx2[FxParams['reverb']].value = this.x * 0.0003;
      } else if (this.fxContext.fx2 === this.fxContext.phaser) {
        this.fxContext.fx2[FxParams['phaser']].value = this.x * 0.0048;
      }
    } else {
      this.fxContext.resetFx();
      window.clearInterval(this.intervalId);
    }
  }

  render() {
    this.updateClasses(this.board.snake.segments, "snake");
    this.updateClasses([this.board.apple.position], "apple");
  }
}

export default SnakeView;
