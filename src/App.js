import React, { Component } from 'react';
import './App.css';


class App extends Component{

  constructor() {
    super()
    this.state = {
      turn :'X' ,
      gameEnded : false,
      board: Array(9).fill('none'),
      totalMoves :0,
      winner: undefined,
      disabled: false
    }
    this.disabled = this.disabled.bind(this);
    this.enabled = this.enabled.bind(this);
  }

  disabled(){
    this.setState({
      disabled: true
    });
  }

  enabled(){
    this.setState({
      disabled: false
    });
  }

  clicked(event) {
    if(this.state.gameEnded === false) {
      var xhr = new XMLHttpRequest()
      console.log(this.state.totalMoves);
      xhr.addEventListener('load', () => {
        this.setState({
          board: JSON.parse(xhr.responseText)[0],
          totalMoves: this.state.totalMoves + 1,
          turn: 'X',
        });
        this.enabled();
        this.refs[JSON.parse(xhr.responseText)[1]].innerText = 'O';
        this.checkResult();
      });
      
      xhr.open("POST", "https://ttt-game-dnn-api.herokuapp.com/", true);
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      

      if(this.state.board[event.target.dataset.square] === 'none') {
        this.disabled();
        this.state.board[event.target.dataset.square] = this.state.turn
        event.target.innerText = this.state.turn;
        this.setState({
          turn: 'X',
          board:this.state.board,
          totalMoves:this.state.totalMoves+1,
        });
        if (this.checkResult() === 'none'){
        xhr.send(JSON.stringify({board: this.state.board}));
      }
      }}
      
    }

  checkResult(){
    var result = this.checkWinner();
      if (result === 'X'){
        this.setState( {
          gameEnded:true,
          winner:'X',
          winnerLine : 'Congrats. X is the winner'
        })

      }
      else if (result === 'O'){
        this.setState( {
          gameEnded:true,
          winner:'O',
          winnerLine : 'Congrats. O is the winner'
        })
      }

      else if (result === 'draw'){
        this.setState( {
          gameEnded:true,
          winner:'draw',
          winnerLine : 'Congrats. This match is a draw'
        })
      }
      else{
        return "none";
      }
  }


  checkWinner() {
    var moves = [[0,3,6],[1,4,7],[2,5,8],
                [0,1,2],[3,4,5],[6,7,8],
                [0,4,8],[2,4,6]]
    var board =  this.state.board
    for(let i=0;i<moves.length;i++)
    {

      if(board[moves[i][0]] === board[moves[i][1]] && board[moves[i][1]] === board[moves[i][2]]) 
      {
        return board[moves[i][0]];
      }
    }
    if(this.state.totalMoves === 8)
    {
      return 'draw'
    }
  }

  render(){
    var divStyle = {
      'pointerEvents':this.state.disabled?'none':'auto'
    };
    return(
      <div id = "game">
        <div id =  "status">
          {this.state.winnerLine}
        </div>
        <div id = "head">
        Have fun playing TIC TAC TOE!!<br/>
        </div>
        
        <div id = "board" onClick={(e)=>this.clicked(e)} style={divStyle}>
          
          <div className = "square" data-square="0" ref="00"></div>
          <div className = "square" data-square="1" ref="01"></div>
          <div className = "square" data-square="2" ref="02"></div>
          <div className = "square" data-square="3" ref="10"></div>
          <div className = "square" data-square="4" ref="11"></div>
          <div className = "square" data-square="5" ref="12"></div>
          <div className = "square" data-square="6" ref="20"></div>
          <div className = "square" data-square="7" ref="21"></div>
          <div className = "square" data-square="8" ref="22"></div>
          

        </div>

      </div>
    );
  }
}

export default App;