
const NUM_CATEGORIES = 6;
const NUM_CLUES_PER_CAT = 5;
const API_URL = "https://jservice.io/api/";

// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];


/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
    let response = await axios.get(`${API_URL}categories?count=100`);
  let catIds = response.data.map(c => c.id);
  return _.sampleSize(catIds, NUM_CATEGORIES);
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
  let response = await axios.get(`${API_URL}category?id=${catId}`);
  let category = response.data;
  let allClues = category.clues;
  let randomClues = _.sampleSize(allClues, NUM_CLUES_PER_CAT);
  let clues = randomClues.map(c => ({
    question: c.question,
    answer: c.answer,
    showing: null,
  }));

  return { title: category.title, clues };  
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
    $("#jeopardy thead").empty();
    // build categories row
    let $tr = $("<tr>");
    for (let ii = 0; ii < NUM_CATEGORIES; ii++) {
      $tr.append($("<th>").text(categories[ii].title));
    }
    $("#jeopardy thead").append($tr);
  
    // Add rows with questions for each category
    $("#jeopardy tbody").empty();
    for (let clueIndex = 0; clueIndex < NUM_CLUES_PER_CAT; clueIndex++) {
      let $tr = $("<tr>");
      for (let ii = 0; ii < NUM_CATEGORIES; ii++) {
        $tr.append($("<td>").attr("id", `${ii}-${clueIndex}`).text("?"));
      }
      $("#jeopardy tbody").append($tr);
    }



}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
    let id = evt.target.id;
    let [catId, clueId] = id.split("-");
    let clue = categories[catId].clues[clueId];
  
    let msg;
    //clumsy attempt to handle error, but for now, it's handled.
    if (clue === undefined)
    {
        msg = "Unable to retrieve Clue."
    }
    else if (!clue.showing) {
      msg = clue.question;
      clue.showing = "question";
    } else if (clue.showing === "question") {
      msg = clue.answer;
      clue.showing = "answer";
    } else {
      // already showing the answer -- ignore click
      return
    }
  
    // Update text of cell
    $(`#${catId}-${clueId}`).html(msg);

}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {

    //didn't get the chance to do this yet

}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
    // didn't get the chance to do this either
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {

    //console.log("inside setupAndStart");
    let catIds = await getCategoryIds();

    categories = [];
  
    for (let catId of catIds) {
      categories.push(await getCategory(catId));
    }
  
    fillTable();
    
}

/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */


window.addEventListener("load", (event) => {
  setupAndStart();
  // handle click on game board square
  $("#jeopardy").on("click", "td", handleClick);
  // handle click on restart button
  $("#restart").click(setupAndStart);
  console.log("page is fully loaded");
});