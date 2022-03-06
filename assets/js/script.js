import { MemoryGame } from './game.js';
import { imagePath } from './util.js';

class GameControls {

    // Binding variables and function to buttons
  constructor (){
    this.sets = 10;
    this.gameMode = "solo";

    // (B2) PRELOAD IMAGES
    for (let i = 0; i <= this.sets; i++) {
      let img = document.createElement("img");
      img.src = `${imagePath}rick-and-morty-${i}.png`;
    }

    // Add a function onclick for the selected level and start the game
    const levelBtns = document.querySelectorAll('#level-select button');
    for (let btn of levelBtns)
      btn.onclick = (e) => this.setLevel(e);

    // Add a function onclick for the selected mode
    const modeBtns = document.querySelectorAll('#mode-select button');
    for(let btn of modeBtns)
      btn.onclick = (e) => this.setMode(e);
  }

  setLevel(e) {
    let btn = e.target;
    this.sets = btn.dataset.numSets;
    if(this.game)
      this.game.clearTimers();

    this.game = new MemoryGame(this.sets, this.gameMode);
  }

  setMode(e) {
    let btn = e.target;
    this.gameMode = btn.dataset.gameMode;
  }
}

/* When page finishes loading, run the game */
window.addEventListener("DOMContentLoaded", () => new GameControls());