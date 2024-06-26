import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function GameMatrixInput({ dimension = 2 }) {
  const createInitialMatrix = () => {
    return [
      ["(0.55,0.80)", "(0.55,0.80)"],
      ["(0,0.25)", "(0,0.25)"]
    ];
  };

  const [matrix, setMatrix] = useState(createInitialMatrix(dimension));

  const handleInputChange = (rowIndex, colIndex, value) => {
    const updatedMatrix = matrix.map((row, rIdx) =>
      rIdx === rowIndex
        ? row.map((cell, cIdx) =>
            cIdx === colIndex ? value : cell
          )
        : row
    );
    setMatrix(updatedMatrix);
  };

  const parseMatrix = () => {
    const matResult = matrix.map(row =>
      row.map(cell => {
        // Update the regular expression to include optional decimals
        const match = cell.match(/\((-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)\)/);
        return match ? { player1: parseFloat(match[1]), player2: parseFloat(match[2]) } : null;
      })
    );
  
    return matResult;
  };
  

  const findNashEquilibrium = () => {
    const parsedMatrix = parseMatrix();

    if (!parsedMatrix || parsedMatrix.some(row => row.some(cell => cell === null))) {
      window.alert('Error: Please make sure all matrix cells are filled correctly.');
      return;
    }

    let nashEquilibria = [];

    // Compare each strategy to find Nash equilibria
    // Player 1 will compare their payoffs in both rows for a given column
    // Player 2 will compare their payoffs in both columns for a given row
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 2; col++) {
        let currentCell = parsedMatrix[row][col];
        let otherRow = 1 - row;
        let otherCol = 1 - col;

        let isPlayer1BestResponse = currentCell.player1 >= parsedMatrix[otherRow][col].player1;
        let isPlayer2BestResponse = currentCell.player2 >= parsedMatrix[row][otherCol].player2;

        // If both players are playing their best response to the other player's strategy, it's a Nash Equilibrium
        if (isPlayer1BestResponse && isPlayer2BestResponse) {
          nashEquilibria.push(`Cell(${row + 1},${col + 1})`);
        }
      }
    }

    window.prompt('Nash Equilibria:', nashEquilibria.join(', ') || 'None');
  };

  const renderMatrixInputs = () =>
    matrix.map((row, rowIndex) => (
      <Grid container item spacing={2} key={rowIndex}>
        {row.map((cell, colIndex) => (
          <Grid item xs={12 / dimension} key={`${rowIndex}-${colIndex}`}>
            <TextField
              label={`Cell ${rowIndex + 1},${colIndex + 1}`}
              type="text"
              value={cell}
              onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
              variant="outlined"
              size="small"
              fullWidth
            />
          </Grid>
        ))}
      </Grid>
    ));

  return (
    <Grid container spacing={2} alignItems="left" justifyContent="left" marginTop="30px">
      {renderMatrixInputs()}
      <Grid item xs={12} >
          <Button variant="contained" color="primary" onClick={findNashEquilibrium}>
            Calculate Nash Equilibrium
          </Button>
      </Grid>
    </Grid>
  );
};

