import { useState, useEffect, useRef } from "react";
import ReactCardFlip from 'react-card-flip';
import useKeypress from 'react-use-keypress';

import './App.css';

function App() {
  const [flipMap, setFlipMap] = useState({});
  const [guess, setGuess] = useState([]);
  const [currentGuess, setCurrentGuess] = useState(0);
  const timeoutRef = useRef(null);

  useKeypress("Enter", (event) => {
    if (guess.length === 5) {
      setCurrentGuess(prev => prev + 1);
      setFlipMap((prev) => ({
        ...prev,
        [`${currentGuess}`]: true,
      }));
    }
  });

  useKeypress("Backspace", (event) => {
    setGuess(prev => prev.slice(0, -1))
  });

  useKeypress(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"], (event) => {
    if (guess.length === 5) {
      return;
    }

    setGuess(prev => prev.concat(event.key))
  });

  useEffect(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }

    if (currentGuess === 0 || currentGuess > 29) {
      return;
    }

    timeoutRef.current = setTimeout(() => {
      console.log("here", currentGuess);
      setCurrentGuess(prev => prev + 1);
      setFlipMap((prev) => ({
        ...prev,
        [`${currentGuess}`]: true,
      }));
    }, 300)
  }, [currentGuess])

  return (
    <>
      <h1 className="title border-b">Wordle</h1>
      <div className="container flex flex-wrap space-between mx-auto mt-16">
        {Array(30).fill("").map((space, index) => (
          <ReactCardFlip key={index} isFlipped={flipMap[index]} flipDirection="vertical">
            <div className="square flex items-center align-center justify-center">
              {guess[index]}
            </div>

            <div className="square flex items-center align-center justify-center">
              <img src={require(`./squares/${index}.jpg`)} alt="" />
            </div>
          </ReactCardFlip>
        ))}
      </div>
    </>
  )
}

export default App;
