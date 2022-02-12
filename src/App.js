import { useState, useEffect, useRef } from "react";
import ReactCardFlip from "react-card-flip";
import useKeypress from "react-use-keypress";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

import "./App.css";

const KEYS_ROW_1 = ["q", "w", "e", "t", "y", "u", "i", "o", "p"];
const KEYS_ROW_2 = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
const KEYS_ROW_3 = ["enter", "z", "x", "c", "v", "b", "n", "m", "⬅️"];

const VALID_LETTERS = [
  "q",
  "w",
  "e",
  "t",
  "y",
  "u",
  "i",
  "o",
  "p",
  "a",
  "s",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  "z",
  "x",
  "c",
  "v",
  "b",
  "n",
  "m",
];

function App() {
  const [flipMap, setFlipMap] = useState({});
  const [guess, setGuess] = useState([]);
  const [currentGuess, setCurrentGuess] = useState(0);
  const timeoutRef = useRef(null);
  const { width, height } = useWindowSize();

  useKeypress("Enter", (event) => {
    if (guess.length === 5) {
      setCurrentGuess((prev) => prev + 1);
      setFlipMap((prev) => ({
        ...prev,
        [`${currentGuess}`]: true,
      }));
    }
  });

  useKeypress("Backspace", (event) => {
    setGuess((prev) => prev.slice(0, -1));
  });

  useKeypress(
    [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
    ],
    (event) => {
      if (guess.length === 5) {
        return;
      }

      setGuess((prev) => prev.concat(event.key));
    }
  );

  useEffect(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }

    if (currentGuess === 0 || currentGuess > 29) {
      return;
    }

    timeoutRef.current = setTimeout(() => {
      setCurrentGuess((prev) => prev + 1);
      setFlipMap((prev) => ({
        ...prev,
        [`${currentGuess}`]: true,
      }));
    }, 330);
  }, [currentGuess]);

  function simulateKeypress(letter) {
    if (guess.length === 5 && letter === "enter") {
      setCurrentGuess((prev) => prev + 1);
      setFlipMap((prev) => ({
        ...prev,
        [`${currentGuess}`]: true,
      }));
    } else if (guess.length === 5 && VALID_LETTERS.includes(letter)) {
      return;
    } else if (letter === "⬅️") {
      setGuess((prev) => prev.slice(0, -1));
    } else {
      setGuess((prev) => prev.concat(letter));
    }
  }

  return (
    <>
      {flipMap["29"] && <Confetti width={width} height={height} />}
      <div className="flex flex-col justify-between">
        <div>
          <h1 className="title border-b">Wordle</h1>
          <div
            className="flex flex-wrap space-between align-center justify-between mx-auto mt-12"
            style={{ width: "330px", height: "410px" }}
          >
            {Array(30)
              .fill("")
              .map((space, index) => (
                <ReactCardFlip key={index} isFlipped={flipMap[index]} flipDirection="vertical">
                  <div className="square flex items-center align-center justify-center">{guess[index]}</div>

                  <div className="square flex items-center align-center justify-center">
                    <img src={require(`./squares/${index}.jpg`)} alt="" />
                  </div>
                </ReactCardFlip>
              ))}
          </div>
        </div>
        <div className="my-3 space-y-3 flex flex-col items-center">
          <div className="flex space-x-2">
            {KEYS_ROW_1.map((letter) => (
              <div
                key={letter}
                onClick={() => simulateKeypress(letter)}
                className="align-center bg-gray-200 flex font-bold items-center justify-center key rounded uppercase hover:cursor-pointer"
              >
                {letter}
              </div>
            ))}
          </div>
          <div className="flex mx-auto space-x-2">
            {KEYS_ROW_2.map((letter) => (
              <div
                key={letter}
                onClick={() => simulateKeypress(letter)}
                className="align-center bg-gray-200 flex font-bold items-center justify-center key rounded uppercase hover:cursor-pointer"
              >
                {letter}
              </div>
            ))}
          </div>
          <div className="flex mx-auto space-x-2">
            {KEYS_ROW_3.map((letter) => (
              <div
                key={letter}
                onClick={() => simulateKeypress(letter)}
                className="align-center bg-gray-200 flex font-bold items-center justify-center key rounded uppercase hover:cursor-pointer px-3"
              >
                {letter}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
