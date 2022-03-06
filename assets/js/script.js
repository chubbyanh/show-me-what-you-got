/* This is main entry point for JavaScripts.
It contains the control for the game menus. */

import { MemoryGame } from './game.js';
import { imagePath } from './util.js';

class GameControls {

    // Binding variables and function to buttons
  constructor (){
    this.sets = 10;
    this.gameMode = "solo";

    // Preload images before starting the game
    for (let i = 0; i <= this.sets; i++) {
      let img = document.createElement("img");
      img.src = `${imagePath}rick-and-morty-${i}.png`;
    }

    // When the game is first loaded, only the Main Menu is visible 
    this.goToSection('main-menu');

    // When click on Play button, only Control Panel is visible 
    const playBtns = document.querySelectorAll('.btn-play');
    for (let btn of playBtns)
      btn.onclick = () => this.goToSection('control-panel');
    
    // When click on Rules button, only Game Rules is visible
    document.querySelector('#btn-rules').onclick = () => this.goToSection('game-rules');

    // When click on Contact button, only Contact Area is visible
    document.querySelector('#btn-contact').onclick = () => this.goToSection('contact-area');

    // When click on Back button, only Main Menu is visible 
    const backBtns = document.querySelectorAll('.btn-back');
    for (let btn of backBtns)
      btn.onclick = () => this.goToSection('main-menu');

    // Select play mode: solo or combat
    const modeBtns = document.querySelectorAll('#mode-select button');
    for(let btn of modeBtns)
      btn.onclick = (e) => this.setMode(e);

    // Select game level: easy (12 cards), medium (16 cards), or hard (20 cards)
    const levelBtns = document.querySelectorAll('#level-select button');
    for (let btn of levelBtns)
      btn.onclick = (e) => this.setLevel(e);
    
    // When click on Start button, only Game Arena is visible and the game starts
    document.querySelector('#start-game button').onclick = () => this.newGame();
  }
 
  goToSection(section) {
    const sections = ['main-menu', 'control-panel', 'game-arena', 'game-rules', 'contact-area'];
    document.getElementById(section).classList.remove('d-none');
    for (let s of sections){
      if (s != section)
        document.getElementById(s).classList.add('d-none');
    }
  }

  setLevel(e) {
    let btn = e.target;
    this.sets = btn.dataset.numSets;
  }

  setMode(e) {
    let btn = e.target;
    this.gameMode = btn.dataset.gameMode;
  }

  newGame() {
    if(this.game)
      this.game.clearTimers();
    this.game = new MemoryGame(this.sets, this.gameMode);
    this.goToSection('game-arena');
  }
}

// When page finishes loading, run the game
window.addEventListener("DOMContentLoaded", () => new GameControls());