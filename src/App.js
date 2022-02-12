import { useState, useEffect, useRef } from "react";
import { useAlert } from "react-alert";
import ReactCardFlip from "react-card-flip";
import Confetti from "react-confetti";
import useKeypress from "react-use-keypress";
import useWindowSize from "react-use/lib/useWindowSize";

import "./App.css";
import words from "./words.txt";

const QWERTY = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
const ASDF = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
const ZXCV = ["z", "x", "c", "v", "b", "n", "m"];
const ENTER = "enter";
const BACKSPACE = "backspace";

const VALID_LETTERS = [...QWERTY, ...ASDF, ...ZXCV];

function App() {
  const [possibleWords, setPossibleWords] = useState([]);
  const [flipMap, setFlipMap] = useState({});
  const [guess, setGuess] = useState([]);
  const [currentGuess, setCurrentGuess] = useState(0);
  const timeoutRef = useRef(null);
  const { width, height } = useWindowSize();

  const alert = useAlert();

  useEffect(() => {
    fetch(words)
      .then((r) => r.text())
      .then((text) => {
        setPossibleWords(text.split("\n"));
      });
  }, []);

  /*
   * This functions as an onSubmit. This logic is
   * scattered in a few places but you can grep for `setFlipMap`
   * to find where the code is repeated.
   *
   * The flipMap is structured as a key-value pair where the key
   * represents an indices and the value is a boolean. When the boolean
   * is set to `true`, the square will flip over.
   */
  useKeypress("Enter", (event) => {
    if (guess.length === 5) {
      if (possibleWords.includes(guess.join(""))) {
        // Initializes board animation
        setCurrentGuess((prev) => prev + 1);
        setFlipMap((prev) => ({ ...prev, [`${currentGuess}`]: true }));
      } else {
        alert.error("Not in word list");
      }
    } else {
      alert.error("Not enough letters");
    }
  });

  useKeypress("Backspace", (event) => {
    setGuess((prev) => prev.slice(0, -1));
  });

  useKeypress(VALID_LETTERS, (event) => {
    if (guess.length === 5) {
      return;
    }

    setGuess((prev) => prev.concat(event.key));
  });

  useEffect(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }

    if (currentGuess === 0 || currentGuess > 29) {
      return;
    }

    // Animates entire board
    timeoutRef.current = setTimeout(() => {
      setCurrentGuess((prev) => prev + 1);
      setFlipMap((prev) => ({ ...prev, [`${currentGuess}`]: true }));
    }, 330);
  }, [currentGuess]);

  function simulateKeypress(letter) {
    if (guess.length === 5 && letter === "enter") {
      if (possibleWords.includes(guess.join(""))) {
        // Initializes board animation
        setCurrentGuess((prev) => prev + 1);
        setFlipMap((prev) => ({ ...prev, [`${currentGuess}`]: true }));
      } else {
        alert.error("Not in word list");
      }
    } else if (guess.length !== 5 && letter === "enter") {
      alert.error("Not enough letters");
      return;
    } else if (guess.length === 5 && VALID_LETTERS.includes(letter)) {
      return;
    } else if (letter === "backspace") {
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
            className="flex bg-gray-200 px-2 py-4 items-center justify-center text-xs md:text-lg font-bold rounded uppercase hover:cursor-pointer"
            style={{ minWidth: "30px" }}
          >
            {letter === "backspace" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"
                />
              </svg>
            ) : (
              letter
            )}
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
          <h1 className="text-4xl tracking-wide py-2 border-b">Wordle</h1>
          <div
            className="flex flex-wrap space-between align-center justify-between mx-auto mt-12"
            style={{ width: "330px", height: "410px" }}
          >
            {Array(30)
              .fill("")
              .map((space, index) => (
                <ReactCardFlip key={index} isFlipped={flipMap[index]} flipDirection="vertical">
                  <div
                    className="text-3xl text-center border-2 flex items-center align-center justify-center"
                    style={{ width: "60px", height: "60px" }}
                  >
                    {guess[index]}
                  </div>

                  <div
                    className="flex items-center align-center justify-center border-2"
                    style={{ width: "60px", height: "60px" }}
                  >
                    <img src={require(`./squares/${index}.jpg`)} alt="" />
                  </div>
                </ReactCardFlip>
              ))}
          </div>
        </div>
        <div className="max-w-full mx-auto space-y-2 mt-6 md:mt-12 p-2">
          {renderKeyRow(QWERTY)}
          {renderKeyRow(ASDF)}
          {renderKeyRow([ENTER, ...ZXCV, BACKSPACE])}
        </div>
      </div>
    </>
  );
}

export default App;
