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
  hint = 1000; // how long to show mismatched cards
  gameMode = "timed"; // game mode, either timed or versus
  memoryLength = 5;

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

    const levelBtns = Array.from(document
      .getElementById("level-select")
      .getElementsByTagName("button"));
    for (let btn of levelBtns)
      btn.onclick = (e) => {
        let btn = e.target;
        this.sets = btn.dataset.numSets;
        this.newGame();
      };

    const modeBtns = Array.from(document
      .getElementById("mode-select")
      .getElementsByTagName("button"));
    for(let btn of modeBtns)
      btn.onclick = (e) => {
        let btn = e.target;
        this.gameMode = btn.dataset.gameMode;
      }
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
    // credits : https://gomakethings.com/how-to-shuffle-an-array-with-vanilla-js/
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
    // console.log(this.grid); // CHEAT

    // (C3) CREATE HTML CARDS
    this.hWrap.innerHTML = "";
    for (let id in this.grid) {
      let card = document.createElement("img");
      card.className = "game-card";
      card.src = `${this.url}rick-and-morty-0.png`;
      card.onclick = () => { this.open(card); };
      card.set = this.grid[id];
      card.open = false;
      card.seen = -1;
      this.hWrap.appendChild(card);
      this.grid[id] = card;
    }

    this.computerMoveA();
  }

  computerMoveA(){
    let card = this.chooseRandomCard();
    this.open(card);
    sleep(1000).then(() => this.computerMoveB());
  }

  computerMoveB() {
    let secondCard = null;

    const useMemory = (1 - Math.random()) > 0.7;
    // Decide if the computer will use its memory of the last few cards its seen
    if (useMemory) {
      const availableCards = Array
        .from(this.hWrap.getElementsByClassName("game-card"))
        .filter(c => c.open == false);
      for(let card of availableCards){
        if(card.set == this.last.set){
          if (card.seen - this.moves < this.memoryLength)
            secondCard = card;
          break;
        }
      }
    }

    // Still haven't chosen, so choose random
    if(secondCard === null) {
      secondCard = this.chooseRandomCard();
    }
    this.open(secondCard);

    sleep(2000).then(() => this.computerMoveA());
  }

  chooseRandomCard() {
    const availableCards = Array
      .from(this.hWrap.getElementsByClassName("game-card"))
      .filter(c => c.open == false);
    return availableCards[Math.floor(Math.random() * availableCards.length)];
  }

  // (D) OPEN A CARD
  open(card){
    if (this.lock != null)
      return false;
    if (card.open)
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
    return false;
  }
}

// https://www.sitepoint.com/delay-sleep-pause-wait/
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

window.addEventListener("DOMContentLoaded", () => new MemoryGame());