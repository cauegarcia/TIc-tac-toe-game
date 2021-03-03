"use strict";

const Player = (sign) => {
  this.sign = sign;

  const getSign = () => {
    return sign;
  }
  return { getSign, sign }
};

const GameMode = (mode) => {
  this.mode = mode;

  const getMode = () => {
    return mode;
  }
  return { getMode }
}
const GameDifficulty = (difficulty) => {
  this.difficulty = difficulty;
  const getDifficulty = () => {
    return difficulty;
  }
  return {getDifficulty};
};
const PlayerChoice = (playerSymbol) => {
  this.playerSymbol = playerSymbol;
  const getPlayerSymbol = () => {
    return playerSymbol;
  };
  return {getPlayerSymbol};
};

let mode = undefined;
let difficulty = undefined;
let playerSymbol = undefined;

const initialInput = (() => {
  
  const modeScreen = document.querySelector('.mode-screen');
  const difficultyScreen = document.querySelector('.difficulty-screen');
  const symbolScreen = document.querySelector('.symbol-screen');
  const initialScreen = document.querySelector('.initial-input');
  const buttons = document.querySelectorAll('button');
  modeScreen.style.display = 'block';

    const updateInput = () => {
    if (mode.getMode() == "human") {
      modeScreen.style.display = 'none';
      initialScreen.style.display = 'none';
      displayer.updateMsg(1, mode.getMode(), playerSymbol.getPlayerSymbol());
      controller.setObjects();
      displayer.setInitialDisplay();
      return;
    };
    if (difficulty == undefined) {
      modeScreen.style.display = 'none';
      difficultyScreen.style.display = 'block';
      return;
    };
    if (playerSymbol == undefined) {
      difficultyScreen.style.display = 'none';
      symbolScreen.style.display = 'block';
      return;
    } else {
      symbolScreen.style.display = 'none';
      initialScreen.style.display = 'none';
      displayer.updateMsg(1, mode.getMode(), playerSymbol.getPlayerSymbol());
    }
  };

  buttons.forEach(button => {
    if (button.classList.contains('.restart')) return;
    button.addEventListener('click', (e) => {
      if (e.target.classList.contains('mode')) {
        mode = GameMode(e.target.id);
        if (mode.getMode() == 'human') {
          playerSymbol = PlayerChoice('X');
        }
        updateInput();
      };
      if (e.target.classList.contains('difficulty')) {
        difficulty = GameDifficulty(e.target.id);
        updateInput();
      };
      if (e.target.classList.contains('symbol')) {
        playerSymbol = PlayerChoice(e.target.id);
        updateInput();
        displayer.setInitialDisplay();
        controller.setObjects();
        controller.checkTurn();
      };
    })
  })

  return {}
})();

const eventHandler = (() => {
  const fields = document.querySelectorAll('.field');
  const restartBtn = document.querySelector('.restart');
  

  fields.forEach(field => {
    field.addEventListener('click', (e) => {
      if ( board.getBoard(e.target.id) !== '') return;
      controller.playRound(parseInt(e.target.id));
      controller.checkTurn();
    })
  })
  restartBtn.addEventListener('click', (e) => {
    controller.resetRound();
    for (let i = 0; i < eventHandler.fields.length; i++) {
      eventHandler.fields[i].innerText = '';
    };
    displayer.updateMsg(1, mode.getMode(), playerSymbol.getPlayerSymbol());
    board.resetBoard();
    controller.checkTurn();
  })
  return { fields }
})();

const board = (() => {
  const currentBoard = ['','','','','','','','',''];

  const getBoard = (index) => {
    return currentBoard[index];
  }
  const setBoard = (index, sign) => {
    currentBoard[index] = sign;
  }
  const resetBoard = () => {
    for (let i = 0; i < currentBoard.length; i++){
      currentBoard[i] = '';
    }
  }
  return {getBoard, setBoard, resetBoard, currentBoard }
})();

const controller = (() => {
  let round = 1;
  let over = false;
  const setObjects = () => {
    if (mode.getMode() == 'human'){
      this.playerX = Player('X');
      this.playerO = Player('O');
      return;
    };
    if (playerSymbol.getPlayerSymbol() == 'X') {
      this.computer = Player('O');
      this.playerX = Player('X');
      return;
    };
    if (playerSymbol.getPlayerSymbol() == 'O') {
      this.computer = Player('X');
      this.playerO = Player('O');
      return;
    };
  
  };

  const playRound = (index) => {
    if (over) return;
    let sign = getcurrentSign();
    board.setBoard(index, sign);
    displayer.displayerTurn(index, sign);
    if (checkWinner(index, sign)) {
      over = true;
      displayer.msgWinner(sign);
      return;
    };
    if (round === 9) {
      displayer.msgDraw();
      return;
    }
    round++;
    displayer.updateMsg(round, mode.getMode(), playerSymbol.getPlayerSymbol());
  };
  
  const getcurrentSign = () => {
    return setTurn().getSign();
  };

  const setTurn = () => {
    if (mode.getMode() == 'human') {
    return round % 2 === 1
    ? playerX
    : playerO
    };
    if (playerSymbol.getPlayerSymbol() == 'X') {
    return round % 2 === 1
    ? playerX
    : computer
    };
    if (playerSymbol.getPlayerSymbol() == 'O') {
      return round % 2 === 1
      ? computer
      : playerO
      };
  };

  const resetRound = () => {
    round = 1;
    over = false;
  };

  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  const checkWinner = (index, sign) => {
    const check = winConditions.filter(conditions => {return conditions.includes(index)})
                    .some(possibility => { return possibility.every(number => {return board.getBoard(number) === sign})});
    return check;
  };
  
  const checkTurn = () => {
    if (mode.getMode() == 'human') return;
     if (setTurn() == computer) {
      robot.playTurn(winConditions);
      return;
    };
    return;
  };

  return { playRound, resetRound, setObjects, checkTurn }
})();

const displayer = (() => {
  const msg = document.querySelector('.msg');
  const displayerTurn = (index,sign) => {
    eventHandler.fields[index].innerText = sign;
  };

  const resetDisplay = () => {
    msg.innerText = 'Player X turn';
  }

  const msgDraw = () => {
    msg.innerText = "It's a draw. No winner at this time.";
  }

  const msgWinner = (sign) => {
    msg.innerText = `Congratulations! Player ${sign} won!`
  }

  const updateMsg = (round, mode, playerSymbol) => {
    let sign;
    if (round % 2 == 1) {sign = 'X'} else {sign = 'O'};
    if (mode == 'human') {msg.innerText = `Player ${sign}'s turn.`; return;};
    if (mode == 'robot' && playerSymbol == sign) {
      msg.innerText = `Player ${sign}'s turn.`;
      return;
    } else {
      msg.innerText = `Robot's turn.`
    }
  }
  const setInitialDisplay = () => {
    document.querySelector('.game-field').classList.remove('noEvents');
    document.querySelector('.restart').disabled = false;
   }
  return { displayerTurn, resetDisplay, msgDraw, msgWinner, updateMsg, setInitialDisplay };
})();

const robot = (() => {
  let winConditions = [];
  const playTurn = (conditions) => {
    winConditions = [];
  for (let i = 0; i < conditions.length; i++){
    winConditions.push(conditions[i]);
  }
  decideAction();
  }

  let playerWinCondition = [];
  const decideAction = () => {
    playerWinCondition = winConditions.filter(condition => {
      let counter = 0;
      for (let i = 0; i < condition.length; i++){
        const fieldStatus = board.getBoard(condition[i]);
        if ( fieldStatus == playerSymbol.getPlayerSymbol()) {
          counter++;
        };
        if ( fieldStatus !== playerSymbol.getPlayerSymbol() && fieldStatus !== '') {
          return false;
        }
      }
      if (counter == 2) {
        return true;
      }
      return false;
    })
    takeAction();
  }

  const takeAction = () => {
    playerWinCondition.length > 0 ? defend() : attack();
  }
  
  const defend = () => {
    const rowToDefend = Math.floor(Math.random() * playerWinCondition.length);
    const fieldToDefend = playerWinCondition[rowToDefend].filter(field => {
      if (board.getBoard(field) !== playerSymbol.getPlayerSymbol()){
        return true;
      } else { return false;}
    });
    setTimeout(function (){controller.playRound(fieldToDefend[0])}, 500);
  };
  const attack = () => {
     let fieldsToPlay = [];
     const winConditionsAvailable = winConditions.filter(condition => {
      return condition.every(number => {return board.getBoard(number) !== playerSymbol.getPlayerSymbol()})
    });
     board.currentBoard.forEach((field, index) => {
      if (field == ''){
          for (let i = 0; i < winConditionsAvailable.length; i++){
            if (winConditionsAvailable[i].includes(index)){
              fieldsToPlay.push(index);
            }
          }
      };
    });
  
    let fieldsToPlayUnique = [...new Set(fieldsToPlay)];
    fieldsToPlay = fieldsToPlayUnique.map(value => {
      return [value, fieldsToPlay.filter(item => item === value).length]
    });
    
    const fieldChosen = () => {
      let fields = [];
      let quantity = 0;
      for (let i = 0; i < fieldsToPlay.length; i++){
        if (fieldsToPlay[i][1] > quantity){
          fields = [];
          fields.push(fieldsToPlay[i]);
          quantity = fieldsToPlay[i][1];
        } else
        {if (fieldsToPlay[i][1] == quantity){
          fields.push(fieldsToPlay[i]);
        }};
      };
      let fieldIndex;
      if (fields.length == 0) {
        board.currentBoard.forEach((field, index) => {
          if (field == '') {
            fieldIndex = index;
          }
        })
      }
      return fieldIndex == undefined ? fields[Math.floor(Math.random() * fields.length)][0]
      : fieldIndex;
    }
      setTimeout(function (){
      controller.playRound(fieldChosen())
    }, 500);

};
  return {playTurn};
})();
