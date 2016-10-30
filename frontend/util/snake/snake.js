import Coord from './coord';

class Snake {
  constructor(board) {
    this.dir = "N";
    this.turning = false;
    this.board = board;

    const center = new Coord(Math.floor(board.dim / 2), Math.floor(board.dim / 2));
    this.segments = [center];

    this.growTurns = 0;
  }

  eatApple() {
    if (this.head().equals(this.board.apple.position)) {
      this.growTurns += 3;
      return true;
    } else {
      return false;
    }
  }

  isOccupying(array) {
    let result = false;
    this.segments.forEach( segment => {
      if (segment.i === array[0] && segment.j === array[1]) {
        result = true;
        return result;
      }
    });
    return result;
  }

  isValid() {
    const head = this.head();

    if (!this.board.validPosition(this.head())) {
      return false;
    }

    for (let i = 0; i < this.segments.length - 1; i++) {
      if (this.segments[i].equals(head)) {
        return false;
      }
    }

    return true;
  }


  head() {
    return this.segments.slice(-1)[0];
  }

  move() {
    this.segments.push(this.head().plus(Snake.DIFFS[this.dir]));
    this.turning = false;
    if (this.eatApple()) {
      this.board.apple.replace();
    }

    if (this.growTurns > 0) {
      this.growTurns -= 1;
    } else {
      this.segments.shift();
    }

    if (!this.isValid()) {
      this.segments = [];
    }
  }

  turn(dir) {
    if (Snake.DIFFS[this.dir].isOpposite(Snake.DIFFS[dir]) ||
      this.turning) {
      return;
    } else {
      this.turning = true;
      this.dir = dir;
    }
  }
}

Snake.DIFFS = {
  "N": new Coord(-1, 0),
  "E": new Coord(0, 1),
  "S": new Coord(1, 0),
  "W": new Coord(0, -1)
};

Snake.SYMBOL = "S";
Snake.GROW_TURNS = 3;

export default Snake;
