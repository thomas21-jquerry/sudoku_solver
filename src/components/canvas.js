import React, { useState } from "react";
import "../App.css"; // Import the CSS file

const initialBoard = Array(9)
  .fill(null)
  .map(() => Array(9).fill("")); // Empty 9x9 board

const SudokuSolver = () => {
  const [board, setBoard] = useState(initialBoard);

  const handleChange = (row, col, value) => {
    if (value === "" || /^[1-9]$/.test(value)) {
      const newBoard = board.map((r, rIdx) =>
        r.map((c, cIdx) => (rIdx === row && cIdx === col ? value : c))
      );
      setBoard(newBoard);
    }
  };

  const isValid = (board, row, col, num) => {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num || board[i][col] === num) return false;
      let boxRow = Math.floor(row / 3) * 3 + Math.floor(i / 3);
      let boxCol = Math.floor(col / 3) * 3 + (i % 3);
      if (board[boxRow][boxCol] === num) return false;
    }
    return true;
  };

  const solveSudoku = (board) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === "") {
          for (let num = 1; num <= 9; num++) {
            if (isValid(board, row, col, String(num))) {
              board[row][col] = String(num);
              if (solveSudoku(board)) return true;
              board[row][col] = ""; // Backtrack
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  const handleSolve = () => {
    const tempBoard = board.map((row) => [...row]); // Deep copy
    if (solveSudoku(tempBoard)) setBoard(tempBoard);
    else alert("No solution exists!");
  };

  const handleReset = () => setBoard(initialBoard);

  return (
    <div className="container">
      <h1>Sudoku Solver</h1>
      <div className="sudoku-board">
        {board.map((row, rIdx) =>
          row.map((cell, cIdx) => (
            <input
              key={`${rIdx}-${cIdx}`}
              className={`cell ${(rIdx + 1) % 3 === 0 ? "bold-bottom" : ""} ${(cIdx + 1) % 3 === 0 ? "bold-right" : ""}`}
              type="text"
              value={cell}
              onChange={(e) => handleChange(rIdx, cIdx, e.target.value)}
            />
          ))
        )}
      </div>
      <div className="buttons">
        <button className="solve-btn" onClick={handleSolve}>Solve</button>
        <button className="reset-btn" onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
};

export default SudokuSolver;
