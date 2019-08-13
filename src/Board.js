import React, { Component } from "react";
import Cell from "./Cell";
import './Board.css';

const BOARD_ANIMATE_1 = [
  [0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 1, 1, 1, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0]
];
const BOARD_ANIMATE_2 = [
  [1, 1, 1, 1, 1],
  [1, 1, 0, 1, 1],
  [1, 0, 0, 0, 1],
  [1, 1, 0, 1, 1],
  [1, 1, 1, 1, 1]
];

class Board extends Component {

  static defaultProps = {
    gridSize: 5
  };

  constructor(props) {
    super(props);

    this.createBoard = this.createBoard.bind(this);
    this.flipCellsAround = this.flipCellsAround.bind(this);
    this.isSolved = this.isSolved.bind(this);
    this.animateBoard = this.animateBoard.bind(this);
    this.createNewGame = this.createNewGame.bind(this);

    this.state = {
      animating: false,
      board: this.createBoard(),
      animationIndex: 1,
      boardSolved: false,
      totalMoves: 0
    };
  }

  componentDidMount() {
    this.solvedTimer = null;
  }

  componentWillUnmount() {
    if (this.solvedTimer) clearTimeout(this.solvedTimer);
  }

  componentDidUpdate() {
    if (this.state.boardSolved && !this.state.animating) {
      if (this.props.gridSize === 5) {
        this.setState({ animating: true });
        let count = 0;
        this.solvedTimer = setTimeout(function handler(c) {
          this.animateBoard();
          if (c < 5) {
            c++;
            this.solvedTimer = setTimeout(handler.bind(this), 350, c);
          } else {
            this.createNewGame();
          }
        }.bind(this), 350, count);
      } else {
        this.createNewGame();
      }
    }
  }

  createNewGame() {
    this.setState(state => {
      return {
        animating: false,
        board: this.createBoard(),
        animationIndex: 1,
        boardSolved: false,
        totalMoves: 0
      }
    });
  }

  createBoard() {
    const { gridSize } = this.props;
    const board = Array.from({ length: gridSize });
    return board.map(i => {
      return Array.from({ length: gridSize }).map(r => {
        return Math.round(Math.random());
      });
    });
  }

  isSolved() {
    const [...board] = this.state.board;
    let solved = true;
    board.forEach(r => {
      if (r.includes(1)) solved = false;
    });
    return solved;
  }

  flipCellsAround(coord) {
    if (this.state.animating || this.state.isSolved) return;

    let { gridSize } = this.props;
    let [...board] = this.state.board;
    let [x, y] = coord.split("-").map(Number);

    function flipCell(x, y) {
      // if this coord is actually on board, flip it
      if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
        board[x][y] = board[x][y] === 0 ? 1 : 0;
      }
    }

    if (x - 1 >= 0) flipCell(x - 1, y);
    if (x + 1 < gridSize) flipCell(x + 1, y);
    if (y - 1 >= 0) flipCell(x, y - 1);
    if (y + 1 < gridSize) flipCell(x, y + 1);
    flipCell(x, y);

    if (this.isSolved()) {
      setTimeout(() => {        
        this.setState(state => {
          return {
            boardSolved: true
          };
        });
      }, 150);
    }
    this.setState(state => {
      return { board, totalMoves: state.totalMoves + 1 };
    });
  }

  animateBoard() {
    this.setState(state => {
      let { animationIndex } = state;
      animationIndex = (animationIndex === 1) ? 2 : 1;
      const board = (animationIndex === 1) ? BOARD_ANIMATE_1 : BOARD_ANIMATE_2;
      return { animating: true, board, animationIndex };
    });
  }

  render() {
    const board = this.state.board;

    const markup = board.map((r, rIdx) => {
      return (
        <tr key={rIdx}>
          {
            r.map((c, cIdx) => {
              const coords = `${rIdx}-${cIdx}`;
              return <Cell
                key={coords}
                coords={coords}
                isLit={c === 1}
                flipCellsAroundMe={this.flipCellsAround}
              />
            })
          }
        </tr>
      );
    });

    return (
      <div>
        <div className="Title">
          <div className="neon-orange">Lights</div>
          <div className="neon-blue">Out</div>
        </div>
        <table className="Board">
          <tbody className="BoardTBody">
            {markup}
          </tbody>
        </table>
        <div className="FooterText">
          <p>Total Moves: {this.state.totalMoves}</p>
          <button className="myButton" onClick={this.createNewGame}>Reset Board</button>
        </div>
      </div>
    )
  }
}

export default Board;
