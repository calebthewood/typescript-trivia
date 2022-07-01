"use strict";

const BASE_API_URL = "http://jservice.io/api/";

const $gameBoard = $("#game-board");
const $loadingScreen = $("#loading-screen");

// Value of game will become the Game instance populated below
let game;

$gameBoard.hide();
$loadingScreen.hide();

/** Fill the HTML table #jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/ game.numCluesPerCat <tr>s,
 *   each with a question for each category in a <td>
 *   (initially, just show a "?" where the question/answer would go.)
 */
function fillTable() {

  $(".categories").empty()
  buildTableHeader();

  $(".gameBoard").empty()
  buildTableBody();
}

/** Builds table header row based on the data stored in this.categories */
function buildTableHeader() {
  const $categoriesArea = $(".categories");
  const categoryTitles = game.categories.map(cat => cat.title);

  console.log(categoryTitles);

  for (let title of categoryTitles) {
    $categoriesArea.append(`
      <th id=${title}>${title}</th>
    `);
  }
}
/**Builds the table body, adds ids for retrieving clue data from current instance of Game */
function buildTableBody() {
  const $cluesArea = $(".gameBoard");

  //num clues should reference actual length of clues array.
  const numCats = 6;
  const numClues = 5;

    //runs for each row
  for (let i = 0; i < numClues; i++) {
   $cluesArea.append(`<tr id="clue-row-${i}" class="clues questionMark">?</tr>`);
    //runs for each category
    for (let j = 0; j < numCats; j++) {

      let clue = game.categories[j].clues[i];

      $(`#clue-row-${i}`).append(`
      <td data-j="${j}" data-i="${i}">?</td>
      `);

    }
  }
}


/** Handle clicking on a clue: show the question or answer, update clue status.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question
 * - if currently "question", show answer
 * - if currently "answer", ignore click
 *
 * */
function handleClick(evt) {
  const $clue = $(evt.target);
  //i = row/clue & j = column/category
  const i = Number($(evt.target).data("i"));
  const j = Number($(evt.target).data("j"));
  //get instance of Clue
  const clue = game.categories[j].clues[i];
  //TODO: I think using i & j will allow me to access the instances directly
  //and forgoe storing clues in data tags.

  console.log("clue: ",clue)

  if (!clue.showing) {
    $clue
      .removeClass("questionMark")
      .addClass("question")
      .text(clue.question)
    clue.updateShowingStatus();
  } else if (clue.showing === "question") {
    $clue
      .removeClass("question")
      .addClass("answer")
      .text(clue.answer);
    clue.updateShowingStatus();
  }
}


/**
 * Shows loading spinner, hides start button and game board
 */
function showLoadingState() {
  $loadingScreen.toggle()
  $("#start").hide();
}

/**
 * Shows game board, updates start button text and hides loading spinner
 */
function hideLoadingState() {
  $loadingScreen .hide()
  $gameBoard.show();
  $("#start")
    .text("Restart")
    .show();
}


// DO NOT CHANGE ANY CODE BELOW THIS LINE

/**
 * Generates new game instance and populates game board in DOM
 */
async function startGame() {
  showLoadingState();

  game = new Game(6, 5);
  await game.populateCategoryData();

  fillTable();
  hideLoadingState();
}

$("#start").on("click", startGame);
$("#jeopardy").on("click", "td", handleClick);