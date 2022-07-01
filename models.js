"use strict";

// gets 5 clues from an array of clues
// let sampledCategoryClues = _.sampleSize(allCategoryClues, [n=this.numCluesPerCat]);
// const clues = await axios.get(`${BASE_API_URL}clues`, { params: {category: catId} });

/** Game class: manages game construction
 *
 *  Game will have:
 *  - numCategories: integer
 *  - numCluesPerCat: integer
 *  - categories:
 *    [
        Category { title: "Math",
          clues: [
            Clue {question: "2+2", answer: "4", showing: null},
            Clue {question: "1+1", answer: "2", showing: null},
            ... 3 more clues ...
          ],
        },
        Category { title: "Literature",
          clues: [
            Clue {question: "Hamlet Author", answer: "Shakespeare", showing: null},
            Clue {question: "Bell Jar Author", answer: "Plath", showing: null}, ...
          ],
        }, ...4 more Categories ...
      ]
 *
 */
class Game {

  /** Construct each Game instance from:
   *
   *  - numCategories: integer
   *  - numCluesPerCat: integer
   *
   */
  constructor(numCategories, numCluesPerCat) {
    this.numCategories = numCategories;
    this.numCluesPerCat = numCluesPerCat;
    this.categories = [];
  }

  /**
   * Simple function to fetch a large batch of high-level category
   * data from jService API.
   *
   * Accepts:
   *   - count: int
   *
   * Returns array of high-level category objects from jService API:
   *
   * [{id, title, clues_count}, {id, title, clues_count}, ... ]
   *
   */
  async fetchCategoryBatch(count) {

    const response = await axios.get(`${BASE_API_URL}categories`,{
      params: { count }
    });

    return response.data;
  }

  /** Get this.numCategories random category IDs from API.
   *
   * Returns array of category ids, eg [4, 12, 5, 9, 20, 1]
   */
  async getRandomCategoryIds(count) {
    //me: gets max # of random clues then exracts 5 random ids.
    const response = await axios.get(`${BASE_API_URL}random`, {
      params: { count }
    });

    const randomClues = _.sampleSize(response.data, this.numCategories);
    return randomClues.map( clue => clue.category.id);
  }


  /** Setup category data for game instance:
   *
   * - get random category Ids
   * - get data for each category
   * - populate categories array read, push Category instance with Clue instances.
   */
  async populateCategoryData() {
    // Note: We've provided some structure for this function, but you'll need
    // to fill in the value for the catIds variable and the body of the loop
    // below.
    this.categories = [];
    let catIds = await this.getRandomCategoryIds(this.numCategories);

    for (let catId of catIds) {

      // TODO: Add necessary code to fetch category data & generate
      // new instance for each catId. Populate categories array accordingly.
      let categoryInstance = await Category.getCategory(catId, this.numCluesPerCat);
      this.categories.push(categoryInstance);

    }
  }
}

/** Category class: holds category data
 *
 *  Category will have:
 *   - title: string
 *   - clues: array of Clue instances [Clue {}, Clue {}, ...]
 */
class Category {

  /** Construct each Category instance from:
   *
   *  - title: string
   *  - clues: array of Clue instances [Clue {}, Clue {}, ...]
   *
   */
  constructor(title, clues) {
    this.title = title;
    this.clues = clues;
  }

  /** Static method to fetch all of the information for a particular
   * category from jService API.
   *
   * Accepts:
   *   - id: int
   *
   * Returns object of category info from API:
   *
   * { id, title, clues_count, clues }
   *
   */
  static async fetchCategoryDetail(id) {

    const category = await axios.get(
      `${BASE_API_URL}category`, { params: { id } }
    );

    const cat = category.data;

    return {
      id: cat.id,
      title: cat.title,
      clues_count: cat.clues_count,
      clues: cat.clues
    };

  }

  /** Static method to return new Category instance with data about a category:
   *
   * Accepts:
   *  - id: integer
   *  - numCluesPerCat: integer
   *
   * Returns Category { title: "Literature", clues: clue-array }
   *
   * Where clue-array is:
   *   [
   *      Clue {question: "Hamlet Author", answer: "Shakespeare", showing: null},
   *      Clue {question: "Bell Jar Author", answer: "Plath", showing: null},
   *      ... 3 more ...
   *   ]
   */
  static async getCategory(id, numCluesPerCat) {
    //get category, sample 5 clues, create 5 Clue instances, return Category instance.
    const category = await this.fetchCategoryDetail(id);
    const fiveClues = _.sampleSize(category.clues, numCluesPerCat);
    const clues = fiveClues.map(clue => new Clue(clue.question, clue.answer));
    const title = category.title;

    return new Category(title, clues);
  }
}

/** Clue class: holds clue data and showing status
 *
 * Clue will have:
 *  - question: string
 *  - answer: string
 *  - showing: default of null, then string of either "question" or "answer"
 */
class Clue {

  /** Construct each Clue instance from:
   *
   *  - question: string
   *  - answer: string
   *
   */
  constructor(question, answer) {
    this.question = question;
    this.answer = answer;
    this.showing = null;
  }

  /** Update showing status on Clue instance depending on current state
   *
   * Accepts: none
   * Returns: undefined
   *
   */
  updateShowingStatus() {
    if (!this.showing) {
      this.showing = "question";
    } else if (this.showing === "question") {
      this.showing = "answer";
    }
  }
}