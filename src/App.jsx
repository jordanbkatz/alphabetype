import { useState, useEffect, useMemo } from 'react';
import { FaRedoAlt, FaGithub } from 'react-icons/fa';

const item = localStorage.getItem('alphabetype-best');
const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
const letterIndex = letter => alphabet.indexOf(letter);
const formatTime = (time) => {
  const seconds = Math.floor(time / 1000);
  const milliseconds = (time / 10) % 100;
  return `${seconds}:${milliseconds.toString().padStart(2, '0')}`;
};
const defaultState = {
  curr: 'a',
  wrong: false,
  finished: false,
  running: false,
  stopwatch: 0,
  best: item ? JSON.parse(item) : null
};

function App() {
  const [state, setState] = useState(defaultState);
  const reset = () => setState(defaultState);
  const letterClass = useMemo(() => letter => {
    let className = ['letter'];
    if (letter === state.curr && !state.finished) {
      if (state.wrong) {
        className.push('wrong');
      }
      else {
        className.push('current');
      }
    }
    if ((letter < state.curr) || (letter === 'z' && state.finished)) {
      className.push('complete');
    }
    return className.join(' ');
  }, [state]);
  useEffect(() => {
    let interval = null;
    if (state.running) {
      interval = setInterval(() => {
        setState(prevState => {
          let newState = {...prevState};
          if (prevState.stopwatch >= 100000) {
            return defaultState;
          }
          else {
            newState.stopwatch += 10;
          }
          return newState;
        });
      }, 10);
    }
    else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [state.running]);
  useEffect(() => {
    const handleKeydown = e => {
      setState(prevState => {
        let newState = {...prevState};
        newState.wrong = false;
        if (e.key === prevState.curr && !prevState.finished) {
          if (e.key === 'a') {
            newState.running = true;
          }
          if (e.key === 'z') {
            newState.finished = true;
            newState.running = false;
            if (!prevState.best || prevState.stopwatch < prevState.best) {
              newState.best = prevState.stopwatch;
              localStorage.setItem('alphabetype-best', JSON.stringify(newState.best));
            }
          }
          else {
            newState.curr = alphabet[letterIndex(prevState.curr) + 1];
          }
        }
        else if ((e.key === "Delete" || e.key === "Backspace") && prevState.curr !== 'a') {
          newState.curr = alphabet[letterIndex(prevState.curr) - 1];
          newState.finished = false;
        }
        else if (e.key === "Return" || e.key === "Enter") {
          newState.curr = 'a';
          newState.wrong = false;
          newState.running = false;
          newState.finished = false;
          newState.stopwatch = 0;
        }
        else if (!prevState.finished) {
          newState.wrong = true;
        }
        return newState;
      });
    }
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    }
  }, [state]);
  return (
    <div className="app">
      <div className="header">
        <div className="timer">
          <p>Time</p>
          <h1>{formatTime(state.stopwatch)}</h1>
        </div>
        <button onClick={reset}>
          <FaRedoAlt className="icon" />
        </button>
        <h1>AlphabeType</h1>
        <a href="https://github.com/jordanbkatz">
          <FaGithub className="icon" />
        </a>
        <div className="best">
          <p>Best</p>
          <h1>{formatTime(state.best)}</h1>
        </div>
      </div>
      <div className="alphabet">
        {alphabet.map(letter => (
          <div className={letterClass(letter)} key={letter}>
            <h1>{letter}</h1>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;