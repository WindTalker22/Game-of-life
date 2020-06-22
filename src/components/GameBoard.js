import React, { useState } from 'react'
import produce from 'immer'

const numRows = 50
const numCols = 50

const GameBoard = () => {
  // <------Creating Grid Beginning------->
  const [grid, setGrid] = useState(() => {
    const rows = []

    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0))
    }

    return rows
  })
  // <-------Creating Grid End---------->

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${numCols}, 20px)`,
      }}
    >
      {grid.map((rows, i) =>
        rows.map((col, j) => (
          <div
            key={`${i}-${j}`}
            onClick={() => {
              const newGrid = produce(grid, (gridCopy) => {
                gridCopy[i][j] = grid[i][j] ? 0 : 1
              })
              setGrid(newGrid)
            }}
            style={{
              width: 20,
              height: 20,
              backgroundColor: grid[i][j] ? 'pink' : undefined,
              border: '1px solid black',
            }}
          />
        ))
      )}
    </div>
  )
}

export default GameBoard
