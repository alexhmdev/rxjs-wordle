/**
 * Observables: fromEvent
 * El método fromEvent nos permite generar observables que capturan eventos del DOM.
 * https://rxjs.dev/api/index/function/fromEvent
 */
import { fromEvent, Subject } from "rxjs";
import WORDS_LIST from "./spanishWordsList.json";

const letterRows = document.getElementsByClassName("letter-row");
const message = document.getElementById("message-text");
const keyBoard = document
  .getElementById("keyboard")
  .getElementsByTagName("button");

const keyboarArray = Array.from(keyBoard);
console.log(keyboarArray);
let userAnswer = [];
const getRandomWord = () =>
  WORDS_LIST[Math.floor(Math.random() * WORDS_LIST.length)];
const rightWord = getRandomWord();
const onKeyDown$ = fromEvent(document, "keydown");
const onKeyChange$ = fromEvent(keyBoard, "click");
let letterIndex = 0;
let letterRowIndex = 0;

const userWinOrLose$ = new Subject();
const insertLetter = {
  next: ({ key }) => {
    if (key.length === 1 && key.match(/[a-z]/i)) {
      // console.log(key);
      // console.log(letterRows);
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
    if (key === "Enter" && userAnswer.length === 5) {
      const rightWordArray = Array.from(rightWord);
      for (let i = 0; i < 5; i++) {
        let letterColor = "";
        let keyColor = "";
        let letterBox = Array.from(letterRows)[letterRowIndex].children[i];
        let letterPositon = Array.from(rightWord).indexOf(
          userAnswer[i].toUpperCase()
        );
        let keyboardLetter = keyboarArray.filter(
          (k) => k.textContent === userAnswer[i].toUpperCase()
        )[0];

        if (letterPositon === -1) {
          letterColor = "letter-grey";
          keyColor = "key-gray";
        } else {
          if (rightWordArray[i] === userAnswer[i].toUpperCase()) {
            letterColor = "letter-green";
            keyColor = "key-green";
          } else {
            letterColor = "letter-yellow";
            keyColor = "key-yellow";
          }
        }
        letterBox.classList.add(letterColor);
        keyboardLetter.classList.add(keyColor);
      }
      if (userAnswer.join("").toUpperCase() === rightWord) {
        userWinOrLose$.next("win");
      }
      letterIndex = 0;
      userAnswer = [];
      letterRowIndex++;
    }
  },
};
onKeyChange$.subscribe((event) => {
  let key = event.target.textContent;
  let idKey = event.target.id;
  if (key != "") {
    insertLetter.next({ key });
  }
  if (idKey === "delete") {
    deleteLetter.next({ key: "Backspace" });
  }
  if (idKey === "enter") {
    checkWord.next({ key: "Enter" });
  }
});
onKeyDown$.subscribe(insertLetter);
onKeyDown$.subscribe(deleteLetter);
onKeyDown$.subscribe(checkWord);
userWinOrLose$.subscribe(() => {
  let letterBox = Array.from(letterRows)[letterRowIndex];
  console.log(letterBox);
  for (let i = 0; i < 5; i++) {
    letterBox.children[i].classList.add("letter-green");
    message.textContent = "¡Ganaste!";
  }
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .then((res) => console.log("service worker registered"))
      .catch((err) => console.log("service worker not registered", err));
  });
}
