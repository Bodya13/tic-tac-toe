import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

function Cell(props) {
  return (
    <button
      className="cell"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderCell(i) {
    return (
      <Cell 
        value={this.props.cells[i]} 
        onClick={() => this.props.onclick(i)}
      />
    )
  }
  render() {
    let i = this.props.winLine;
    return (
      <div className="board">
        <div className={"finish-line line-"+i}></div>
        <div className="board-row">
          {this.renderCell(0)}
          {this.renderCell(1)}
          {this.renderCell(2)}
        </div>
        <div className="horisontal-line"></div>
        <div className="vertical-line-1"></div>
        <div className="board-row">
          {this.renderCell(3)}
          {this.renderCell(4)}
          {this.renderCell(5)}
        </div>
        <div className="horisontal-line"></div>
        <div className="vertical-line-2"></div>
        <div className="board-row">
          {this.renderCell(6)}
          {this.renderCell(7)}
          {this.renderCell(8)}
        </div>
      </div>
    )
  }
}

function Score(props) {
  return (
    <div>
      <h3>Score</h3>
      <div className="score">
        <div>{props.players[0]}: {props.winNumbers[0]}</div>
        <div>{props.players[1]}: {props.winNumbers[1]}</div>
      </div>
    </div>
  )
}

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: true
    }
  }
  render() {
    return (
      <div className={this.state.active ? "modal" : "modal inactive"}>
        <div className="window">
          <h3>Write a name for player X:</h3>
          <input type="text" 
            value={this.props.players[0]} 
            onChange={(event, i=0) => this.props.onchange(event.target.value, i)} 
          />
          <h3>Write a name for player O:</h3>
          <input type="text" 
            value={this.props.players[1]} 
            onChange={(event, i=1) => this.props.onchange(event.target.value, i)}
          />
          <button onClick={() => {this.setState({active: !this.state.active})}}>OK</button>
        </div>
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cells: Array(9).fill(null),
      xIsNext: true,
      players: ['PlayerX', 'PlayerO'],
      winNumbers: [0, 0]
    }
  }

  handleClick(i) {
    let cells = this.state.cells;
    let [winner] = this.winner(cells);

    if (cells[i] || winner) {
      if (winner) {
        cells = Array(9).fill(null);
        this.setState({
          cells,
          xIsNext: true,
        })
      }
      return;
    } else {
      cells[i] = this.state.xIsNext ? 'X' : 'O';
    }

    [winner] = this.winner(cells);
    if (winner) {
      this.calculateWinNumbers(winner)
    }

    let draw = this.isDraw(cells);
    if (draw) {
      alert('It is the draw')
      cells = Array(9).fill(null);
      this.setState({
        cells,
        xIsNext: true,
      })
    }

    this.setState ({
      cells,
      xIsNext: !this.state.xIsNext
    })
  }

  winner(cells) {
    let lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
        return [cells[a], i];
      }
    }
    return [null, null];
  }

  handleChange(value, i) {
    let players = this.state.players;
    players[i] = value === '' ? players[i] : value;
    this.setState({
      players
    })
  }

  calculateWinNumbers(winner) {
    let winNumbers = this.state.winNumbers;
    winner === 'X' ? winNumbers[0]++ : winNumbers[1]++;
    this.setState({
      winNumbers
    })
  }

  isDraw(cells) {
    let lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]
    let draw = false;

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      const row = [cells[a], cells[b], cells[c]]

      if (row.some(e => e === 'X') && row.some(e => e === 'O')){
        draw = true
      } else {
        draw = false;
        return;
      }
    }

    return draw;
  }

  render() {
    let cells = this.state.cells;
    let [, i] = this.winner(cells);

    return (
      <div className="container">
        <Modal onchange={(value, i) => this.handleChange(value, i)}  players={this.state.players}/>
        <Board onclick={(i) => this.handleClick(i)} cells={this.state.cells} winLine={i} />
        <Score players={this.state.players} winNumbers={this.state.winNumbers}/>
      </div>
    )
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Game />
  </React.StrictMode>,
  document.getElementById('root')
);
reportWebVitals();
