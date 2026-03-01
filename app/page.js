'use client';

import { useEffect, useMemo, useState } from 'react';

const MAX_CLUES = 3;

function getStorageKey() {
  return 'mystery-object-progress';
}

function getTodayDateString() {
  return new Date().toISOString().slice(0, 10);
}

function buildShareGrid(cluesUsed) {
  // 3x3 grid similar to Wordle-style share output.
  return Array.from({ length: 9 }, (_, idx) => (idx < cluesUsed ? '🟩' : '⬛'))
    .reduce((rows, icon, idx) => {
      const row = Math.floor(idx / 3);
      rows[row] = `${rows[row] || ''}${icon}`;
      return rows;
    }, [])
    .join('\n');
}

export default function HomePage() {
  const [puzzle, setPuzzle] = useState(null);
  const [guess, setGuess] = useState('');
  const [clueIndex, setClueIndex] = useState(0);
  const [status, setStatus] = useState('playing');
  const [message, setMessage] = useState('');
  const [streak, setStreak] = useState({ current: 0, lastSolvedDate: null });

  useEffect(() => {
    async function loadPuzzle() {
      const response = await fetch('/api/puzzle/today');
      if (!response.ok) {
        setMessage('No puzzle available for today yet.');
        return;
      }
      const data = await response.json();
      setPuzzle(data);

      const stored = localStorage.getItem(getStorageKey());
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.date === data.date) {
          setClueIndex(parsed.clueIndex || 0);
          setStatus(parsed.status || 'playing');
        }
        setStreak(parsed.streak || { current: 0, lastSolvedDate: null });
      }
    }

    loadPuzzle();
  }, []);

  useEffect(() => {
    if (!puzzle) return;
    localStorage.setItem(
      getStorageKey(),
      JSON.stringify({
        date: puzzle.date,
        clueIndex,
        status,
        streak
      })
    );
  }, [puzzle, clueIndex, status, streak]);

  const currentImage = useMemo(() => {
    if (!puzzle) return '';
    if (status !== 'playing') return puzzle.fullImage;
    const clues = [puzzle.clue1Image, puzzle.clue2Image, puzzle.clue3Image];
    return clues[clueIndex];
  }, [puzzle, clueIndex, status]);

  async function submitGuess(event) {
    event.preventDefault();
    if (!guess.trim()) return;

    const response = await fetch('/api/puzzle/guess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guess })
    });

    const data = await response.json();

    if (data.isCorrect) {
      setStatus('won');
      setMessage('Correct! Great job.');
      const today = getTodayDateString();
      setStreak((prev) => {
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        const continued = prev.lastSolvedDate === yesterday;
        return {
          current: prev.lastSolvedDate === today ? prev.current : continued ? prev.current + 1 : 1,
          lastSolvedDate: today
        };
      });
      return;
    }

    setMessage('Not quite. Try again or reveal the next clue.');
  }

  function revealNextClue() {
    if (clueIndex < MAX_CLUES - 1) {
      setClueIndex((prev) => prev + 1);
      return;
    }
    setStatus('lost');
    setMessage('Out of clues! The full object is now revealed.');
  }

  async function shareResults() {
    if (!puzzle) return;
    const puzzleNumber = Math.ceil(
      (new Date(puzzle.date).getTime() - new Date('2024-01-01').getTime()) / 86400000
    );

    const cluesUsed = status === 'won' ? clueIndex + 1 : MAX_CLUES;

    const text = `Mystery Object #${puzzleNumber}\n${buildShareGrid(cluesUsed)}\nSolved in ${cluesUsed} clues!`;

    if (navigator.share) {
      await navigator.share({ text });
    } else {
      await navigator.clipboard.writeText(text);
      setMessage('Result copied to clipboard!');
    }
  }

  if (!puzzle) {
    return <main className="container"><p>{message || 'Loading daily puzzle...'}</p></main>;
  }

  return (
    <main className="container">
      <h1>Mystery Object</h1>
      <p className="muted">Daily Puzzle: {puzzle.date}</p>
      <p className="muted">Current streak: {streak.current} day(s)</p>

      <div className="image-card">
        <img src={currentImage} alt="Mystery clue" className="main-image" />
      </div>

      {status === 'playing' ? (
        <>
          <form className="guess-form" onSubmit={submitGuess}>
            <input
              value={guess}
              onChange={(event) => setGuess(event.target.value)}
              placeholder="Enter your guess"
              aria-label="Guess the object"
            />
            <button type="submit">Submit Guess</button>
          </form>

          <button
            className="secondary"
            onClick={revealNextClue}
            disabled={clueIndex >= MAX_CLUES && status !== 'playing'}
          >
            Reveal Next Clue ({clueIndex + 1}/{MAX_CLUES})
          </button>
        </>
      ) : (
        <div className="result-card">
          <h2>{status === 'won' ? 'Solved!' : 'Game Over'}</h2>
          <p>Clues used: {status === 'won' ? clueIndex + 1 : MAX_CLUES}</p>
          <button onClick={shareResults}>Share Result</button>
        </div>
      )}

      {message && <p className="feedback">{message}</p>}
    </main>
  );
}
