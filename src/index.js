/**
 * Observables: fromEvent
 * El método fromEvent nos permite generar observables que capturan eventos del DOM.
 * https://rxjs.dev/api/index/function/fromEvent
 */
import { fromEvent, Subject } from "rxjs";
import WORDS_LIST from "./spanishWordsList.json";
import ENGLISH_WORDS_LIST from "./englishWordList.json";

const letterRows = document.getElementsByClassName("letter-row");
const message = document.getElementById("message-text");
let userAnswer = [];
const getRandomWord = () =>
  WORDS_LIST[Math.floor(Math.random() * WORDS_LIST.length)];
const rightWord = getRandomWord();
console.log(rightWord);
const onKeyDown$ = fromEvent(document, "keydown");

let letterIndex = 0;
let letterRowIndex = 0;

const userWinOrLose$ = new Subject();
const insertLetter = {
  next: ({ key }) => {
    if (key.length === 1 && key.match(/[a-z]/i)) {
      console.log(key);
      console.log(letterRows);
      let letterBox =
        Array.from(letterRows)[letterRowIndex].children[letterIndex];
      letterBox.textContent = key;
      letterBox.classList.add("filled-letter");
      userAnswer.push(key);
      console.info(userAnswer);
      letterIndex < 5 ? letterIndex++ : (letterIndex = 0);
    }
  },
};

const deleteLetter = {
  next: ({ key }) => {
    if (key === "Backspace") {
      let letterBox =
        Array.from(letterRows)[letterRowIndex].children[letterIndex - 1];
      letterBox.textContent = "";
      userAnswer.pop();
      console.info(userAnswer);
      letterBox.classList.remove("filled-letter");
      letterIndex > 0 ? letterIndex-- : (letterIndex = 0);
    }
  },
};

const checkWord = {
  next: ({ key }) => {
    if (key === "Enter") {
      const rightWordArray = Array.from(rightWord);
      for (let i = 0; i < 5; i++) {
        let letterColor = "";
        let letterBox = Array.from(letterRows)[letterRowIndex].children[i];
        console.log(letterBox);
        let letterPositon = Array.from(rightWord).indexOf(
          userAnswer[i].toUpperCase()
        );
        console.log(letterPositon);

        if (letterPositon === -1) {
          letterColor = "letter-grey";
        } else {
          if (rightWordArray[i] === userAnswer[i].toUpperCase()) {
            letterColor = "letter-green";
          } else {
            letterColor = "letter-yellow";
          }
        }
        letterBox.classList.add(letterColor);
      }
      if (userAnswer.length === 5) {
        if (userAnswer.join("").toUpperCase() === rightWord) {
          userWinOrLose$.next("win");
        }
        letterIndex = 0;
        userAnswer = [];
        letterRowIndex++;
      }
    }
  },
};
onKeyDown$.subscribe(insertLetter);
onKeyDown$.subscribe(deleteLetter);
onKeyDown$.subscribe(checkWord);
userWinOrLose$.subscribe((value) => {
  let letterBox = Array.from(letterRows)[letterRowIndex];
  console.log(letterBox);
  for (let i = 0; i < 5; i++) {
    letterBox.children[i].classList.add("letter-green");
    message.textContent = "¡Ganaste!";
  }
});
