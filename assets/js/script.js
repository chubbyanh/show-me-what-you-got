/* This is main entry point for JavaScripts.
It contains the control for the game menus. */

/* Credits:
This game is built on top of the Simple Memory Game in Vanilla JavaScript tutorial by Code Boxx.
Please find the original source code here:
https://code-boxx.com/simple-memory-game-javascript/
*/

import { MemoryGame } from "./game.js";
import { imagePath } from "./util.js";

class GameControls {
  // Binding variables and function to buttons
  constructor() {
    // Preload all images before starting the game
    for (let i = 0; i <= this.sets; i++) {
      let img = document.createElement("img");
      img.src = `${imagePath}rick-and-morty-${i}.png`;
    }

    // When the game is first loaded, only the Main Menu is visible
    this.goToSection("main-menu");

    // When click on Play button, only Control Panel is visible
    const playBtns = document.querySelectorAll(".btn-play");
    for (let btn of playBtns)
      btn.onclick = () => this.goToSection("control-panel");

    // When click on Rules button, only Game Rules is visible
    document.querySelector("#btn-rules").onclick = () =>
      this.goToSection("game-rules");

    // When click on Contact button, only Contact Area is visible
    document.querySelector("#btn-contact").onclick = () =>
      this.goToSection("contact-area");

    // When click on Back/ Surrender/ Quit button, only Main Menu is visible
    const backBtns = document.querySelectorAll(".btn-back");
    for (let btn of backBtns)
      btn.onclick = () => {
        if (this.game) { // stops the countdown timer if the game is running
          this.game.clearTimers();
          this.game = null;
        }
        this.goToSection("main-menu");
      };

    // Select play mode: solo or combat
    // Select game level: easy (12 cards), medium (16 cards), or hard (20 cards)
    const modeBtns = document.querySelectorAll(
      "#mode-select button, #level-select button"
    );
    for (let btn of modeBtns) btn.onclick = (e) => this.selectBtn(e);

    // When click on Start button, only Game Arena is visible and the game starts
    document.querySelector("#start-game button").onclick = () => this.newGame();
  }

  goToSection(section) {
    const sections = [
      "main-menu",
      "control-panel",
      "game-arena",
      "game-rules",
      "contact-area",
      "messages",
    ];
    document.getElementById(section).classList.remove("d-none");
    for (let s of sections) {
      if (s != section) document.getElementById(s).classList.add("d-none");
    }
  }

  goToMessage(msg) {
    const msgs = [
      "solo-win-msg",
      "solo-lose-msg",
      "combat-win-msg",
      "combat-lose-msg",
    ];
    document.getElementById(msg).classList.remove("d-none");
    for (let m of msgs) {
      if (m != msg) document.getElementById(m).classList.add("d-none");
    }
    this.goToSection("messages");
  }

  selectBtn(e) {
    let siblings = e.target.parentNode.querySelectorAll("button");
    for (let btn of siblings)
      if (e.target != btn) btn.classList.remove("selected");
    e.target.classList.add("selected");
  }

  newGame() {
    if (this.game) this.game.clearTimers();

    const sets = document.querySelector("#level-select button.selected").dataset
      .numSets;
    const gameMode = document.querySelector("#mode-select button.selected")
      .dataset.gameMode;

    this.game = new MemoryGame(sets, gameMode, this);
    this.goToSection("game-arena");
  }
}

// When page finishes loading, run the game
window.addEventListener("DOMContentLoaded", () => new GameControls());