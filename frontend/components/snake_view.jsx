import Board from '../util/snake/board';

class SnakeView {
  constructor() {
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
    } else {
      alert("You lose!");
      window.clearInterval(this.intervalId);
    }
  }

  render() {
    this.updateClasses(this.board.snake.segments, "snake");
    this.updateClasses([this.board.apple.position], "apple");
  }
}

export default SnakeView;
