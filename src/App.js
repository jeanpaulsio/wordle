import { useState, useEffect, useRef } from "react";
import ReactCardFlip from "react-card-flip";
import useKeypress from "react-use-keypress";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

import "./App.css";

const KEYS_ROW_1 = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
const KEYS_ROW_2 = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
const KEYS_ROW_3 = ["enter", "z", "x", "c", "v", "b", "n", "m", "⌫"];

const VALID_LETTERS = [
  "q",
  "w",
  "e",
  "r",
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
    } else if (letter === "⌫") {
      setGuess((prev) => prev.slice(0, -1));
    } else {
      setGuess((prev) => prev.concat(letter));
    }
  }

  function renderKeyRow(row) {
    return (
      <div className="max-w-sm mx-auto flex justify-center space-x-2">
        {row.map((letter) => (
          <div
            key={letter}
            onClick={() => simulateKeypress(letter)}
            className="flex bg-gray-200 px-2 py-4 justify-center font-bold rounded uppercase hover:cursor-pointer"
            style={{ minWidth: "30px" }}
          >
            {letter}
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {flipMap["29"] && <Confetti width={width} height={height} />}
      <div>
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
        <div className="max-w-full mx-auto space-y-3 mt-12">
          {renderKeyRow(KEYS_ROW_1)}
          {renderKeyRow(KEYS_ROW_2)}
          {renderKeyRow(KEYS_ROW_3)}
        </div>
      </div>
    </>
  );
}

export default App;
