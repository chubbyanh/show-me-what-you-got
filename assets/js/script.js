// Declare the game objects and properties
class MemoryGame {
  // (A) PROPERTIES
  // (A1) HTML ELEMENT
  hWrap = null; // html game wrapper
  // (A2) GAME SETTINGS & FLAGS
  url = "assets/images/"; // url to images
  sets = 10; // number of sets to match
  grid = []; // current game grid
  moves = 0; // total number of moves
  matched = 0; // number of sets that have been matched
  last = null; // last opened card
  lock = null; // timer, lock game controls when showing mismatched cards
  hint = 800; // how long to show mismatched cards
  gameMode = "solo"; // game mode, either solo or combat
  player = "human";
  humanScore = 0;
  computerScore = 0;
  memoryLength = 5;

    // Binding variables and function to buttons
  constructor (){
    this.hWrap = document.getElementById("game-board");

    // (B2) PRELOAD IMAGES
    let img,
      loaded = -1;
    for (let i = 0; i <= this.sets; i++) {
      img = document.createElement("img");
      img.onload = () => {
        loaded++;
        if (loaded == this.sets) {
          this.newGame();
        }
      };
      img.src = `${this.url}rick-and-morty-${i}.png`;
    }

    // Add a function onclick for the selected level and start the game
    const levelBtns = document.querySelectorAll('#level-select button');
    for (let btn of levelBtns)
      btn.onclick = (e) => {
        let btn = e.target;
        this.sets = btn.dataset.numSets;
        this.newGame();
      };

    // Add a function onclick for the selected mode
    const modeBtns = document.querySelectorAll('#mode-select button');
    for(let btn of modeBtns)
      btn.onclick = (e) => {
        let btn = e.target;
        this.gameMode = btn.dataset.gameMode;
      };
  }

  newGame(){
    // (C1) RESET ALL FLAGS
    clearTimeout(this.lock);
    this.lock = null;
    this.moves = 0;
    this.matched = 0;
    this.last = null;
    this.grid = [];
    this.visible = [];
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
    for (let id in this.grid) {
      let card = document.createElement("img");
      card.className = "game-card";
      card.src = `${this.url}rick-and-morty-0.png`;
      card.onclick = () => { this.open(card, "human"); };
      card.set = this.grid[id];
      card.open = false;
      card.seen = -1;
      this.hWrap.appendChild(card);
      this.grid[id] = card;
    }

    this.humanScore = this.computerScore = 0;

    // If game mode is combat, who goes first is random 50:50
    if (this.gameMode == "combat"){
      if(Math.random() > 0.5){
        this.player = "computer"; // if computer goes first, pause for 1 second
        sleep(1000).then(() => this.computerMoveA());
      } else {
        this.player = "human";
      }
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
          if (card.seen - this.moves < this.memoryLength)
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

  // (D) OPEN A CARD
  open(card, player){
    if (this.lock != null)
      return false;
    if (card.open)
      return false;
    // Ignore clicks when player isn't active
    if (player != this.player)
      return false;

    // (D1) UPDATE FLAGS & HTML
    card.open = true;
    this.moves++;
    card.seen = this.moves;
    card.src = `${this.url}rick-and-morty-${card.set}.png`;
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

      // END GAME?
      if (this.matched == this.sets) {
        alert("YOU WIN! TOTAL MOVES " + this.moves);
        this.newGame();
      }
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
      card.src = `${this.url}rick-and-morty-0.png`;
      this.last.src = `${this.url}rick-and-morty-0.png`;
      this.last = null;
      this.lock = null;
    }, this.hint);

    if(this.gameMode == "combat") {
      // Switch active player
      this.player = this.player == "human" ? "computer" : "human";
      if(this.player == "computer")
        sleep(1000).then(() => this.computerMoveA());
    }

    return false;
  }
}

// Credits: https://www.sitepoint.com/delay-sleep-pause-wait/
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* When page finishes loading, run the game */
window.addEventListener("DOMContentLoaded", () => new MemoryGame());