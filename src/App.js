import { useState, useEffect, useRef } from "react";
import ReactCardFlip from "react-card-flip";
import Confetti from "react-confetti";
import useKeypress from "react-use-keypress";
import useWindowSize from "react-use/lib/useWindowSize";

import "./App.css";

const QWERTY = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
const ASDF = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
const ZXCV = ["z", "x", "c", "v", "b", "n", "m"];
const ENTER = "enter";
const BACKSPACE = "⌫";

const VALID_LETTERS = [...QWERTY, ...ASDF, ...ZXCV];

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
    } else if (guess.length !== 5 && letter === "enter") {
      return;
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
            className={`flex bg-gray-200 px-2 py-4 items-center justify-center text-xs md:text-lg font-bold rounded uppercase hover:cursor-pointer${
              letter === "⌫" ? " text-xl" : ""
            }`}
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
        <div className="max-w-full mx-auto space-y-2 mt-12 p-2">
          {renderKeyRow(QWERTY)}
          {renderKeyRow(ASDF)}
          {renderKeyRow([ENTER, ...ZXCV, BACKSPACE])}
        </div>
      </div>
    </>
  );
}

export default App;
