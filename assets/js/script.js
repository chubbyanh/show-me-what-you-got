class MemoryGame {
  // (A) PROPERTIES
  // (A1) HTML ELEMENT
  hWrap = null // html game wrapper
  // (A2) GAME SETTINGS & FLAGS
  url = "assets/images/"; // url to images
  sets = 10; // number of sets to match
  grid = []; // current game grid
  moves = 0; // total number of moves
  matched = 0; // number of sets that have been matched
  last = null; // last opened card
  lock = null; // timer, lock game controls when showing mismatched cards
  hint = 1000; // how long to show mismatched cards

  // (B) PRELOAD
  preload(){
    // (B1) GET HTML GAME WRAPPER
    this.hWrap = document.getElementById("game-board");

    // (B2) PRELOAD IMAGES
    let img,
      loaded = -1;
    for (let i = 0; i <= this.sets; i++) {
      img = document.createElement("img");
      img.onload = () => {
        loaded++;
        if (loaded == this.sets) {
          this.reset();
        }
      };
      img.src = `${this.url}rick-and-morty-${i}.png`;
    }
  }

  // (C) RESET GAME
  reset(){
    // (C1) RESET ALL FLAGS
    clearTimeout(this.lock);
    this.lock = null;
    this.moves = 0;
    this.matched = 0;
    this.last = null;
    this.grid = [];
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
      this.hWrap.appendChild(card);
      this.grid[id] = card;
    }
  }

  // (D) OPEN A CARD
  open(card){
    if (this.lock == null) {
      if (!card.open) {
        // (D1) UPDATE FLAGS & HTML
        card.open = true;
        this.moves++;
        card.src = `${this.url}rick-and-morty-${card.set}.png`;
        card.classList.add("open");

        // (D2) FIRST CARD - SET IN LAST
        if (this.last == null) {
          this.last = card;
        }

        // (D3) SECOND CARD - CHECK MATCH
        else {
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
              this.reset();
            }
          }

          // (D3-3) NOT MATCHED - CLOSE BOTH CARDS ONLY AFTER A WHILE
          else {
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
          }
        }
      }
    }
  }
}

const game = new MemoryGame();
window.addEventListener("DOMContentLoaded", game.preload);