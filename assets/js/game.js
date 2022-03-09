// This contains the code for the game arena.
/* Credits:
  This game is built on top of the Simple Memory Game in Vanilla JavaScript tutorial by Code Boxx.
  Please find the original source code here:
  https://code-boxx.com/simple-memory-game-javascript/
*/
import { sleep, imagePath } from "./util.js";

class MemoryGame {
  constructor(sets, mode, parent) {
    // Declare the game objects and properties
    this.memoryLength = 6; // number of cards the computer can remember
    this.sets = sets; // number of sets to match
    this.hint = 800; // how long to show mismatched cards
    this.gameMode = mode; // game mode, either solo or combat
    this.timer = null; // countdown timer

    this.hWrap = document.getElementById("game-board");
    this.computerScoreWrap = document.getElementById("computer-score");
    this.humanScoreWrap = document.getElementById("human-score");
    this.currentPlayerWrap = document.getElementById("current-player");
    this.timerWrap = document.getElementById("game-timer");

    this.lock = null; // timer, lock game controls when showing mismatched cards
    this.moves = 0; // total number of moves
    this.matched = 0; // number of sets that have been matched
    this.last = null; // last opened card
    this.grid = []; // current game grid
    this.parent = parent; // reference to objects that created the game
    this.computerScore = 0; // reset the computer's score
    this.humanScore = 0; // reset the human's score

    /* Create a list of numbers where each number represents a card,
      and the list contains each number twice.
    */
    for (let s = 1; s <= this.sets; s++) {
      this.grid.push(s);
      this.grid.push(s);
    }

    // Reshuffle the list of cards randomly
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

    /* Create HTML cards,
      where each card has a set variable, using the number from grid
    */
    this.hWrap.innerHTML = "";
    const openFunction = (evt) => this.open(evt.target, "You");
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

    /* By default, game mode is solo.
      Gamer can change this by click on the buttons to choose between solo or combat.
      If game mode is combat, who goes first is random 50:50.
        - If computer goes first, pause for 1 second before turning the first card.
      If game mode is NOT combat, countdown timer starts.
    */
    if (this.gameMode === "combat") {
      if (Math.random() > 0.5) {
        this.currentPlayer = "Giant Head";
        sleep(1000).then(() => this.computerMoveA());
      } else {
        this.currentPlayer = "You";
      }
      document.getElementById("solo-info").classList.add("d-none");
      document.getElementById("combat-info").classList.remove("d-none");
    } else {
      this.currentPlayer = "You";
      this.remainingTime = 100;
      this.timer = setInterval(() => this.countdown(), 1000);
      document.getElementById("combat-info").classList.add("d-none");
      document.getElementById("solo-info").classList.remove("d-none");
    }
  }
  /* When it's computers turn to play, firstly it will choose a random unopened card.
    After turning the first card, computer will pause for 1 second, then turn the second card.
    When turning the second card, computer will decide if use its memory of the last few cards its seen.
      - 70% chance that computer will use its memory.
      - If computer uses its memory, it only remembers the last 6 cards.
    Otherwise, computer will choose the second card randomly from all unopened cards.
  */
  computerMoveA() {
    let firstCard = this.chooseRandomCard();
    this.open(firstCard, "Giant Head");
    let secondCard = null;

    const useMemory = Math.random() <= 0.7;
    if (useMemory) {
      const availableCards = Array.from(
        this.hWrap.querySelectorAll(".game-card")
      ).filter((c) => c.open == false);
      for (let card of availableCards) {
        if (card.set == firstCard.set) {
          if (card.seen > 0 && this.moves - card.seen < this.memoryLength) secondCard = card;
          break;
        }
      }
    }

    if (secondCard === null) secondCard = this.chooseRandomCard(); // chooses 2nd card randomly

    sleep(1000).then(() => this.computerMoveB(secondCard)); // pauses for 1 second, then opens the 2nd card
  }

  computerMoveB(card) {
    let matched = this.open(card, "Giant Head");
    if (matched && this.matched != this.sets) sleep(1000).then(() => this.computerMoveA());
  }

  chooseRandomCard() {
    const availableCards = Array.from(this.hWrap.querySelectorAll(".game-card")) // select all the cards
      .filter((c) => c.open == false); // filter for only unopened cards
    return availableCards[Math.floor(Math.random() * availableCards.length)]; // pick a random card from all unopened cards
  }

  // Coundown timer for solo mode
  countdown() {
    if (this.remainingTime == 0) this.endGame();
    else this.remainingTime--;
  }

  // Turns a card
  open(card, player) {
    if (this.lock != null) return false;
    if (card.open) return false;
    if (player != this.currentPlayer) return false; // ignore clicks when player isn't active

    card.open = true;
    this.moves++;
    card.seen = this.moves;
    card.src = `${imagePath}rick-and-morty-${card.set}.png`; // updates the image
    card.classList.add("open"); // updates CSS styling for the opened card

    // Remembering the first card, so that can be compared to the second card
    if (this.last == null) {
      this.last = card;
      return false; // exit from function on first card
    }

    // Turns the second card. From here, the code only runs on the second card.
    // Remove CSS
    card.classList.remove("open");
    this.last.classList.remove("open");

    // The second card is matched with the first card
    if (card.set == this.last.set) {
      // Update flags + CSS
      this.matched++;
      card.classList.add("right");
      this.last.classList.add("right");
      this.last = null;

      // Count scores for combat mode
      if (this.gameMode == "combat") {
        if (this.currentPlayer == "You") this.humanScore++;
        else this.computerScore++;
      }

      // When all the cards are opened, game ends
      if (this.matched == this.sets) this.endGame();
      return true; // exit from function when cards are matched
    }

    /* Check if two cards are matched.
      If not, close both cards but only after a while.
      From here, the code only runs if the cards aren't matched.
    */
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
      this.lock = null; // unlock game controls
    }, this.hint);

    /* Switching turns between human and computer */
    if (this.gameMode == "combat") {
      this.currentPlayer = this.currentPlayer == "You" ? "Giant Head" : "You";
      if (this.currentPlayer == "Giant Head") // computer take its turn after 1 sec
        sleep(1000).then(() => this.computerMoveA());
    }

    return false;
  }

  /* When game ends, the corresponding message appears
      to let gamer know if they lose or win,
      and allow them to return to main menu (quit), or to game control panel (play).
  */
  endGame() {
    this.currentPlayer = null;
    this.clearTimers();
    let section = null;
    if (this.gameMode == "combat") {
      if (this.humanScore > this.computerScore) {
        section = "combat-win-msg";
      } else {
        section = "combat-lose-msg";
      }
      document.querySelector(`#${section} .count-human-cards`).innerHTML = this.humanScore;
      document.querySelector(`#${section} .count-computer-cards`).innerHTML = this.computerScore;

    } else {
      if (this.matched == this.sets) {
        section = "solo-win-msg";
        document.querySelector(`#${section} .count-time`).innerHTML = this.remainingTime;
      } else {
        section = "solo-lose-msg";
      }
      document.querySelector(`#${section} .count-moves`).innerHTML = this.moves;
    }

    this.parent.goToMessage(section);
  }

  // When game ends, clear the timers
  clearTimers() {
    clearInterval(this.timer);
    clearTimeout(this.lock);
  }

  /* Storing variables in the web page,
    so that easier to modify in a consistant way */

  get currentPlayer() {
    return this.currentPlayerWrap.innerHTML;
  }
  set currentPlayer(p) {
    this.currentPlayerWrap.innerHTML = p;
  }

  get humanScore() {
    return this.humanScoreWrap.innerHTML;
  }
  set humanScore(s) {
    this.humanScoreWrap.innerHTML = s;
  }

  get computerScore() {
    return this.computerScoreWrap.innerHTML;
  }
  set computerScore(s) {
    this.computerScoreWrap.innerHTML = s;
  }

  get remainingTime() {
    const time = this.timerWrap.innerHTML.split(":");
    return time[0] * 60 + parseInt(time[1]);
  }
  set remainingTime(t) {
    this.timerWrap.innerHTML = `${Math.floor(t / 60)}:${(t % 60)
      .toString()
      .padStart(2, "0")}`;
  }
}

export { MemoryGame };
