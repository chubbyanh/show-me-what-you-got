# Show Me What You Got
__[View the live project here](https://chubbyanh.github.io/show-me-what-you-got/)__

__Show Me What You Got__ is a memory matching game using characters from [Rick and Morty tv series](https://www.imdb.com/title/tt2861424/). Gamers can play solo against the countdown timer or against the computer (a.k.a. the giant alien head). This mini webgame targets gamers using mobile/tablet but also can be played on desktop.

This is the second milestone project with [Code Institute](https://codeinstitute.net/ie/). The main purpose of this project is to design an interactive Front-End web application using HTML, CSS and JavaScript based on the principles of user experience design, accessibility and responsivity.
   
## Table of Contents:
1. [Game Design](#game-design)
    1. [Target Users](#target-users)
    2. [Game Stories](#game-stories)
    2. [Game Play](#game-play)
    3. [Visual Design](#visual-design)
    4. [Scope](#scope)
2. [Features](#features)
    1. [Existing Features](#existing-features)
    2. [Features Left to Implement](#features-left-to-implement)
3. [Technologies Used](#technologies-used)
4. [Testing](#testing)
    1. [UX Stories Testing](#ux-stories-testing)
    2. [Validator Testing](#validator-testing )
    3. [Unfixed Bugs](#unfixed-bugs)
5. [Deployment](#deployment)
    1. [GitHub Pages](#github-pages)
    2. [Forking Repository](#forking-the-github-repository)
    3. [Cloning the project](#cloning-the-project)
8. [Credits](#credits)
    1. [Content](#content)
    2. [Media](#media)
9. [Acknowledgements](#acknowledgements)
10. [Disclaimer](#disclaimer)

## Game Design
### Target Users
This is a hobby project with the main purpose is to show my study results in JavaScript module with Code Institute. So that I don't have a business strategy here. My target users could be:
- People who want to play simple games on the go
- People who want to improve their memory skills by playing games
- People who are fans of Rick and Morty tv series and want to play some fun games with related characters and stories

### Game Stories

A giant alien head suddenly appears and threatens to eliminate the Earth using giant lasers, from an interglatic talent competition, unless the Earth can show them what we got. While Rick and Morty are composing a new catchy song to save the world, __you__ will have to buy some time for them by playing a matching game.

### Game Play
There are __02 play modes__: play solo against the countdown timer (under the giant head's supervision, of course!), or play against the giant head itself.

At the beginning of the game, all the cards are mixed up and laid in row, face down on the table.

- __Play solo against the countdown timer:__
   - Player turns 1 card to start the game. This card stays open.
   - Player turns the 2nd card.
     - If these two cards are a pair, then they stay open.
     - If these two cards are not a pair, then they both turn faced down again. 
   - Player keep doing like that until all the cards are open within the given time frame (and player wins!); or until time's up (and player loses!)
   - All the attemps will be recorded, so player will know how many attemps they had to try throughout the game.
   - If player wins, they will also know how much unused time they have. That will be the time they contribute to the world saving mission!

- __Play against the giant head:__
   - Who starts the game (player or the giant head) is random. 
   - If player is chosen to start the game, then: player turn the 1st card, this card stays open.
   - Player turn the 2nd card.
      - If these two cards are a pair, then they stay open. It's a win for the player, and he/she can turn 2 more cards.
      - If these two cards are not a pair, then they both turn faced down, and it's the giant head's turn to play.
   - Player and the giant head take turns to keep doing like that, until all the cards are open. All the wins will be recorded, so at the end of the game, who has more wins will be the winner.


- There are __03 levels__: easy (12 cards), normal (16 cards), and hard (20 cards). At the end of each game, player can choose to stay at the same level/mode, or switch to a different one.
    
### Visual Design

### Scope

## Features
  
### Existing Features

### Features Left to Implement

## Technologies Used
- HTML5, CSS3, [Bootstrap 5](https://getbootstrap.com/docs/5.1/getting-started/introduction/)
- [VSCode](https://code.visualstudio.com/) as development environment, [Git](https://git-scm.com/) as Version Control tool
- [GitHub](https://github.com/) to host my code, [GitHub Pages](https://pages.github.com/) to publish the game
- [Balsamig](https://balsamiq.com/) for wireframing
- [Firefox Dev Tool](https://developer.mozilla.org/en-US/docs/Tools) for debugging
- [Google Font](https://fonts.google.com/), [Font Awesome](https://fontawesome.com/), [Hex2rgba](http://hex2rgba.devoth.com/) for styling
- [TinyPNG](https://tinypng.com/), [Canva](https://www.canva.com/), [GIMP](https://www.gimp.org/) for optimizing and editing images
- [W3.CSS Color Generator](https://www.w3schools.com/w3css/w3css_color_generator.asp) to generate color themes

## Testing 
### Manual Testing
__User Stories:__
- As a player, I want to know about this game's rules.
   - Player can learn quickly about the game's rules by clicking on the Game Rules button. 
- As a player, I want to turn on/ turn off the sound as I wish.
   - The sound is off on default. Player can turn the sound on by clicking on the Sound button. 
- As a player, I want to choose the level of difficulties and the play mode before starting the game.
   - When player clicks on the Play button, there will be a pop-up to help them choose the level and mode that they want to play at. 
- As a player, I want to switch to another level of difficulties and/or another play mode.
   - When player finishes a game, there will be a pop-up to help them choose if they want to keep playing at the same level and mode, or switch. 
- As a player, I want to quit the game at any time.
   - There is a Quit button on top of the game area to help player quit at any time. 
- As a player, I want to know if I won or lost.
   - When player finishes a game, there will be a pop-up to let them know if they won or lost. 
- As a __solo__ player, I want to know how much time I have left to finish the game.
   - There is a countdown timer on the top of the game area to help player keep track of how much time they have left. 
- As a __solo__ player, I want to know how many attemps I have made to finish this game.
   - When player finishes a game, there will be a pop-up to let them know how many attemps they have made to finish this game.
- As a __solo__ player, I want to know how much time I have contributed to the world saving mission!
   - When player wins a game, there will be a pop-up to let them know how much unused time they still have, and that will be the amount of time they contribute to the world saving mission as well.
- As a player and a Rick and Morty's fan, I want to see my beloved characters and stories in the game.
   - Background images, stories, and characters in the game are borrowed from Rick and Morty tv series.
- As a player, I want to report a bug or contact with the developer.
   - There is a contact form that help player report bug or get in contact easily. 

### Validator Testing 
__[HTML Validator Testing](https://validator.w3.org/)__

__[CSS Validator Testing](https://jigsaw.w3.org/css-validator/)__

__[JavaScript Validator Testing](https://jshint.com/)__

__[Google Chrome Lighthouse](https://developers.google.com/web/tools/lighthouse)__

__[Color Contrast Accessibility Validator](https://color.a11y.com/)__

### Unfixed Bugs

## Deployment
### GitHub Pages

The steps to deploy via GitHub Pages:

1. Log into Github account.
2. Navigate to the [Repository](https://github.com/chubbyanh/show-me-what-you-got).
3. Click the 'Settings' option at the top of the repository.
4. Click the 'Pages' option on the left-hand menu, located near the bottom.
5. Within the 'Source' tab Select the drop-down titled 'None'.
6. Select the branch named 'main' (in some cases it can be named 'Master').
7. Click 'Save'.
8. You will be prompted with a URL to your deployed site.
9. Site deployed.

When the above steps have been completed, it can sometimes take a moment for the deployed URL to update. It is enough to refresh the page until the site is fully deployed.

### Forking The GitHub Repository

To use this code and make changes without affecting the original code you can do what is called 'Forking the repository'. By forking this repository you are given a copy of the code at that moment in time that you can use freely. To fork this repository you need to follow the following few steps:

1. Log into your GitHub account.
2. Navigate to the [Repository](https://github.com/chubbyanh/show-me-what-you-got) that you want to fork.
3. In the upper-right of the repository, click the 'Fork' button.
4. A copy of the Repository will now be available within your repositories.

You will now have a copy of the code available to clone and work on without affecting the original code.

### Cloning the Project

To make a local clone of the project follow these steps:

1. Log into your GitHub account.
2. Navigate to the [Repository](https://github.com/chubbyanh/show-me-what-you-got).
3. In the upper section of the repository click the dropdown named 'Code'.
4. Copy the SHH address.
5. Open GitBash
6. Navigate to the correct directory.
7. Create a new directory named 'show-me-what-you-got'.
8. CD into 'show-me-what-you-got'.
9. Enter 'git clone SSH_ADDRESS'
10. GitBash will clone the repository into this directory.
11. Enter 'code .' and this will open VSCODE and happy coding.

__[The live link can be found here](https://chubbyanh.github.io/show-me-what-you-got/)__

## Credits
### Content
- Content of this game was written by the developer. However, the game's general rules were taken and adjusted from [memozor.com](https://www.memozor.com/pdf/article/memory_card_game_rules_quick_and_simple.pdf).

### Media
### Code

- This game was built on top of [the Simpe Memory Game in Vanilla JavaScript tutorial by Code Boxx](https://code-boxx.com/simple-memory-game-javascript/). Things I have changed:
   - 

- Memory game tutorials: [Code Sketch](https://www.youtube.com/watch?v=eMhiMsEC9Uk)


## Acknowledgements

## Disclaimer
This game was created for educational purposes only.
