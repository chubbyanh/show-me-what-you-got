/* This contains the code for the game arena. */
import { sleep, imagePath } from "./util.js";

class MemoryGame {

  constructor (sets, mode){
    // Declare the game objects and properties
    this.memoryLength = 6;
    this.sets = sets; // number of sets to match
    this.hint = 800; // how long to show mismatched cards
    this.gameMode = mode; // game mode, either solo or combat
    this.timer = null;

    this.hWrap = document.getElementById("game-board");
    this.computerScoreWrap = document.getElementById("computer-score");
    this.humanScoreWrap = document.getElementById("human-score");
    this.currentPlayerWrap = document.getElementById("current-player");
    this.timerWrap = document.getElementById("game-timer");

    this.newGame();
  }

  newGame(){
    // (C1) RESET ALL FLAGS
    this.clearTimers();
    this.lock = null; // timer, lock game controls when showing mismatched cards
    this.moves = 0; // total number of moves
    this.matched = 0; // number of sets that have been matched
    this.last = null; // last opened card
    this.grid = []; // current game grid
    this.humanScore = 0;
    this.computerScore = 0;

    for (let s = 1; s <= this.sets; s++) {
      this.grid.push(s);
      this.grid.push(s);
    }

    // (C2) RANDOM RESHUFFLE CARDS
    // Credits: https://gomakethings.com/how-to-shuffle-an-array-with-vanilla-js/
    let current = this.sets * 2,
      temp,
      random;
    while (0 !== current) {
      random = Math.floor(Math.random() * current);
      current -= 1;
      temp = this.grid[current];
      this.grid[current] = this.grid[random];
      this.grid[random] = temp;
    }

    // (C3) CREATE HTML CARDS
    this.hWrap.innerHTML = "";
    const openFunction = (evt) => this.open(evt.target, "human");
    for (let id in this.grid) {
      let card = document.createElement("img");
      card.className = "game-card";
      card.src = `${imagePath}rick-and-morty-0.png`;
      card.onclick = openFunction;
      card.set = this.grid[id];
      card.open = false;
      card.seen = -1;
      this.hWrap.appendChild(card);
      this.grid[id] = card;
    }

    // If game mode is combat, who goes first is random 50:50
    if (this.gameMode == "combat"){
      if(Math.random() > 0.5){
        // if computer goes first, pause for 1 second
        this.currentPlayer = "computer";
        sleep(1000).then(() => this.computerMoveA());
      } else {
        this.currentPlayer = "human";
      }
    } else {
      this.currentPlayer = "human";
      this.remainingTime = 100;
      this.timer = setInterval(() => this.countdown(), 1000);
    }

  }

  computerMoveA(){
    let firstCard = this.chooseRandomCard(); // guess a random card that isn't already matched
    this.open(firstCard, "computer");

    let secondCard = null;

    // Decide if the computer will use its memory of the last few cards its seen
    const useMemory = (1 - Math.random()) > 0.7; // 70% chances that computer will use its memory
    if (useMemory) {
      const availableCards = Array.from(this.hWrap
          .querySelectorAll(".game-card"))
        .filter(c => c.open == false);
      for(let card of availableCards){
        if(card.set == firstCard.set){
          // computer only remembers last 6 cards
          if (this.moves - card.moves < this.memoryLength)
            secondCard = card;
          break;
        }
      }
    }

    // Still haven't chosen, so choose random
    if(secondCard === null)
      secondCard = this.chooseRandomCard();

    // pause for 1 second, then play the second card
    sleep(1000).then(() => this.computerMoveB(secondCard));
  }

  computerMoveB(card) {
    let matched = this.open(card, "computer");
    if (matched)
      sleep(1000).then(() => this.computerMoveA());
  }

  chooseRandomCard() {
    const availableCards = Array.from(this.hWrap
        .querySelectorAll(".game-card")) // select all the cards
      .filter(c => c.open == false); // filter for only unopened cards
    return availableCards[Math.floor(Math.random() * availableCards.length)]; // pick a random card from all unopened cards
  }

  countdown() {
    if (this.remainingTime == 0)
      this.endGame();
    else
      this.remainingTime --;
  }

  // (D) OPEN A CARD
  open(card, player){
    if (this.lock != null)
      return false;
    if (card.open)
      return false;
    // Ignore clicks when player isn't active
    if (player != this.currentPlayer)
      return false;

    // (D1) UPDATE FLAGS & HTML
    card.open = true;
    this.moves++;
    card.seen = this.moves;
    card.src = `${imagePath}rick-and-morty-${card.set}.png`;
    card.classList.add("open");

    // (D2) FIRST CARD - SET IN LAST
    if (this.last == null) {
      this.last = card;
      return false;
    }

    // (D3) SECOND CARD - CHECK MATCH

    // (D3-1) REMOVE CSS CLASS
    card.classList.remove("open");
    this.last.classList.remove("open");

    // (D3-2) MATCHED
    if (card.set == this.last.set) {
      // UPDATE FLAGS + CSS
      this.matched++;
      card.classList.add("right");
      this.last.classList.add("right");
      this.last = null;

      if(this.gameMode == "combat"){
        if(this.currentPlayer == "human")
          this.humanScore ++;
        else
          this.computerScore ++;
      }

      // END GAME?
      if (this.matched == this.sets)
        this.endGame();
      return true;
    }

    // (D3-3) NOT MATCHED - CLOSE BOTH CARDS ONLY AFTER A WHILE
    card.classList.add("wrong");
    this.last.classList.add("wrong");
    this.lock = setTimeout(() => {
      card.classList.remove("wrong");
      this.last.classList.remove("wrong");
      card.open = false;
      this.last.open = false;
      card.src = `${imagePath}rick-and-morty-0.png`;
      this.last.src = `${imagePath}rick-and-morty-0.png`;
      this.last = null;
      this.lock = null;
    }, this.hint);

    if(this.gameMode == "combat") {
      // Switch active player
      this.currentPlayer = this.currentPlayer == "human" ? "computer" : "human";
      if(this.currentPlayer == "computer")
        sleep(1000).then(() => this.computerMoveA());
    }

    return false;
  }

  endGame() {
    this.currentPlayer = null;
    this.clearTimers();
    if (this.matched != this.sets)
      alert("you lose");
    else
      alert("YOU WIN! TOTAL MOVES " + this.moves);
  }

  clearTimers() {
    clearInterval(this.timer);
    clearTimeout(this.lock);
  }


  get currentPlayer() { return this.currentPlayerWrap.innerHTML; }
  set currentPlayer(p) { this.currentPlayerWrap.innerHTML = p; }

  get humanScore() { return this.humanScoreWrap.innerHTML; }
  set humanScore(s) { this.humanScoreWrap.innerHTML = s; }

  get computerScore() { return this.computerScoreWrap.innerHTML; }
  set computerScore(s) { this.computerScoreWrap.innerHTML = s; }

  get remainingTime() {
    const time = this.timerWrap.innerHTML.split(":");
    return time[0]*60+parseInt(time[1]);
  }
  set remainingTime(t) {
    this.timerWrap.innerHTML = `${Math.floor(t / 60)}:${(t % 60).toString().padStart(2, "0")}`;
  }
}

export { MemoryGame };