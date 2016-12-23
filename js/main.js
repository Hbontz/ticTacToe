var squareArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8'],
	squares = document.getElementsByClassName('square'),
	board = [null, null, null, null, null, null, null, null, null],
	winners = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]],
	move = [];

Array.prototype.pairs = function (func) {
	for (var i = 0; i < this.length - 1; i++) {
		for (var j = i; j < this.length - 1; j++) {
			func([this[i], this[j+1]]);
		}
	}
};

move = squareArray.map(function(val){
	return document.getElementById(val);
});


var Game = function() {
	this.move = move;
	this.state = 0;
	this.nextState = 0;
	this.letter = '';
	this.opponentLetter = '';
	this.board = board;
};

Game.prototype.playerTurn = function(letter, otherLetter, stateSwitch, currentState) {
	var self = this, i;
	this.state = currentState;
	for(i = 0; i < squares.length; i++){
		squares[i].addEventListener('click', function(e){
			e.preventDefault();
			if (this.innerHTML == '' && self.state == 3) {
				self.board[this.getAttribute('id')] = letter;
				this.innerHTML = letter;
				self.newState(stateSwitch);
			} else if (this.innerHTML == '' && self.state == 1) {
				self.board[this.getAttribute('id')] = letter;
				this.innerHTML = letter;
				self.newState(stateSwitch);
			}
		});
	}
};

Game.prototype.computerTurnO = function(letter, otherLetter, stateSwitch) {
	if (this.move[4].innerHTML == '') {
		this.move[4].innerHTML = letter;
		this.board[4] = letter;
		this.newState(stateSwitch);
	} else if (this.move[4].innerHTML == 'X') {
		if (this.move[2].innerHTML == '') {
			this.move[2].innerHTML = letter;
			this.board[2] = letter;
			this.newState(stateSwitch);
		} else {
			this.autoMove(letter, otherLetter);
			this.newState(stateSwitch);
		}
	} else if (this.move[4].innerHTML == letter){
		if (this.board[2] == 'X' && this.board[6] =='X') {
			if (this.move[1].innerHTML == '' && this.move[3].innerHTML == '' && this.move[5].innerHTML == '' && this.move[7].innerHTML == '') {
				this.move[1].innerHTML = letter;
				this.board[1] = letter;
				this.newState(stateSwitch);
			} else {
				this.autoMove(letter, otherLetter);
				this.newState(stateSwitch);
			}
		} else {
			this.autoMove(letter, otherLetter);
			this.newState(stateSwitch);
		}
	}
};

Game.prototype.computerTurnX = function(letter, otherLetter, stateSwitch) {
	var countO = this.letterCount(this.board, 'O');
	if (this.move[0].innerHTML == '') {
		this.move[0].innerHTML = letter;
		this.board[0] = letter;
		this.newState(stateSwitch);
	} else if (countO == 1) {
		if (this.board[2] == 'O' || this.board[6] == 'O' || this.board[4] == 'O') {
			this.move[8].innerHTML = letter;
			this.board[8] = letter;
			this.newState(stateSwitch);
		} else if (this.board[3] == otherLetter || this.board[7] == otherLetter || this.board[8] == otherLetter ) {
			this.move[2].innerHTML = letter;
			this.board[2] = letter;
			this.newState(stateSwitch);
		} else if (this.board[1] == otherLetter || this.board[5] == otherLetter) {
			this.move[6].innerHTML = letter;
			this.board[6] = letter;
			this.newState(stateSwitch);
		}
	} else if (countO == 2) {
		if (this.board[0] == 'X' && this.board[8] == 'X') {
			this.autoMove(letter, otherLetter);
			this.newState(stateSwitch);
		} else if (this.board[0] == 'X' && this.board[6] == 'X' && this.board[5] == 'O') {
			this.autoMove(letter, otherLetter);
			this.newState(stateSwitch);
		} else if (this.board[0] == 'X' && this.board[6] == 'X' && this.board[1] == 'O') {
			if (this.move[3].innerHTML == '') {
				this.move[3].innerHTML = letter;
				this.board[3] = letter;
				this.newState(5);
			} else {
				this.move[8].innerHTML = letter;
				this.board[8] = letter;
				this.newState(stateSwitch);
			}
		} else if (this.board[0] == 'X' && this.board[2] == 'X' && this.board[8] == 'O') {
			if (this.move[1].innerHTML == '') {
				this.move[1].innerHTML = letter;
				this.board[1] = letter;
				this.newState(5);
			} else {
				this.move[6].innerHTML = letter;
				this.board[6] = letter;
				this.newState(stateSwitch);
			}
		} else if (this.board[0] == 'X' && this.board[2] == 'X') {
			this.autoMove(letter, otherLetter);
			this.newState(stateSwitch);
		}
	} else {
		this.autoMove(letter, otherLetter);
		this.newState(stateSwitch);
	}
};

Game.prototype.letterCount = function(array, letter) {
	var count = 0, i;
	for (i = 0; i < array.length; i++) {
		if (array[i] === letter) {
			count++;
		}
	}
	return count;
};


Game.prototype.autoMove = function(currentLetter, oppLetter) {
	var self = this, idx, win, blocked, indicesOpp, indicesSelf, numArr, j, num, ind;
	function getIndices (letter){
		var arr = [];
		for (idx = 0; idx < self.board.length; idx++) {
			if (board[idx] == letter) {
				arr.push(idx);
			}
		}
		return arr;
	}
	win = false;
	blocked = false;
	indicesOpp = getIndices(oppLetter);
	indicesSelf = getIndices(currentLetter);
	function checkSquare(idx, arr) {
		numArr = [0, 1, 2];
		for (j = 0; j < numArr.length; j ++) {
			num = numArr[j];
			if (self.move[winners[idx][num]].innerHTML == '') {
				self.move[winners[idx][num]].innerHTML = currentLetter;
				self.board[winners[idx][num]] = currentLetter;
				if (arr == indicesSelf) {
					win = true;
					return self.board;
				} else if (arr == indicesOpp) {
					blocked = true;
					return self.board;
				}
			}
		}
	}
	function mover(array) {
		array.pairs(function(pair){
			var i;
			for (i = 0; i < winners.length; i++) {
				if (winners[i].indexOf(pair[0]) != -1 && winners[i].indexOf(pair[1]) != -1) {
					checkSquare(i, array);
				}
			}
		});
	}
	mover(indicesSelf);
	if (win) {
		this.newState(5); //computer wins
	} else if (!win) {
		mover(indicesOpp);
		if (this.board.indexOf(null) == -1) {
			this.newState(6); //tie
		} else if (!blocked) {
			for (ind = 0; ind < this.board.length; ind++) {
				if (this.board[ind] == null) {
					this.move[ind].innerHTML = currentLetter;
					this.board[ind] = currentLetter;
					break;
				}
			}
		}
	}
};

Game.prototype.newState = function(state) {
	switch (state) {
	case 1: //player is x
		this.state = 1;
		this.letter = 'X';
		this.opponentLetter = 'O';
		this.nextState = 2;
		this.playerTurn(this.letter, this.opponentLetter, this.nextState, this.state);
		break;
	case 2: //computer is o
		this.letter = 'O';
		this.opponentLetter = 'X';
		this.nextState = 1;
		this.computerTurnO(this.letter, this.opponentLetter, this.nextState);
		break;
	case 3: //player is o
		this.state = 3;
		this.letter = 'O';
		this.opponentLetter = 'X';
		this.nextState = 4;
		this.playerTurn(this.letter, this.opponentLetter, this.nextState, this.state);
		break;
	case 4: //computer is x
		this.letter = 'X';
		this.opponentLetter = 'O';
		this.nextState = 3;
		this.computerTurnX(this.letter, this.opponentLetter, this.nextState);
		break;
	case 5: //computer wins
		document.getElementById('playerFirst').style.display = 'none';
		document.getElementById('computerFirst').style.display = 'none';
		document.getElementById('win').style.display = 'block';
		document.getElementById('board').className = 'avoidClicks';
		break;
	case 6: //tie
		document.getElementById('playerFirst').style.display = 'none';
		document.getElementById('computerFirst').style.display = 'none';
		document.getElementById('tie').style.display = 'block';
		document.getElementById('board').className = 'avoidClicks';
	}
};
var theGame = new Game();

var playerIsX = document.getElementById('playerX'),
	playerIsO = document.getElementById('playerO'),
	reset = document.getElementById('resetBtn');

playerIsX.addEventListener('click', function(){
	document.getElementById('hideIt1').style.display = 'none';
	document.getElementById('hideIt2').style.display = 'none';
	document.getElementById('playerFirst').style.display = 'block';
	theGame.newState(1);
});

playerIsO.addEventListener('click', function(){
	document.getElementById('hideIt1').style.display = 'none';
	document.getElementById('hideIt2').style.display = 'none';
	document.getElementById('computerFirst').style.display = 'block';
	theGame.newState(4);
});

reset.addEventListener('click', function(){
	window.location.reload();
});