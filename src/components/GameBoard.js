import React, { useState, useCallback, useRef } from 'react'
import produce from 'immer'

const numRows = 30
const numCols = 40

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
]

const generateEmptyGrid = () => {
  const rows = []

  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0))
  }

  return rows
}

const GameBoard = () => {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid()
  })
  const [sum, setSum] = useState(0)
  const [generation, setGeneration] = useState(0)
  const timeRef = useRef(300)

  const [running, setRunning] = useState(false)

  const runningRef = useRef(running)
  runningRef.current = running

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return
    }
    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let neighbors = 0
            operations.forEach(([x, y]) => {
              //^^^ looks for neighbors in all directions whether alive or dead
              const newI = i + x
              const newJ = j + y
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                neighbors += g[newI][newJ]
              }
            })

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0
            } else if (g[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1
            }
          }
        }
      })
    })

    setTimeout(runSimulation, timeRef.current)
  }, [timeRef.current])

  return (
    <>
      <div className='ButtonBox'>
        <div className='Buttons'>
          <button
            onClick={() => {
              setRunning(!running)
              if (!running) {
                runningRef.current = true
                runSimulation()
              }
            }}
          >
            {running ? 'Stop' : 'Start'}
          </button>
          <button
            onClick={() => {
              const rows = []

              for (let i = 0; i < numRows; i++) {
                rows.push(
                  Array.from(Array(numCols), () =>
                    Math.random() > 0.5 ? 1 : 0
                  )
                )
              }

              setGrid(rows)
            }}
          >
            Random
          </button>
          <button
            onClick={() => {
              setGrid(generateEmptyGrid())
            }}
          >
            Clear
          </button>
          <button
            onClick={() => {
              timeRef.current = 5
            }}
          >
            Speed Up
          </button>
          <button
            onClick={() => {
              timeRef.current = 300
            }}
          >
            Normal
          </button>
          <button
            onClick={() => {
              timeRef.current = 800
            }}
          >
            Slow Down
          </button>
        </div>
      </div>
      <div
        className='Board'
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
                  //^^^immer produces a copy of the grid to dbl buffer
                  gridCopy[i][j] = grid[i][j] ? 0 : 1
                })
                setGrid(newGrid)
              }}
              style={{
                // living cells
                width: 20,
                height: 20,
                backgroundColor: grid[i][j] ? 'black' : undefined,
                border: '1px solid black',
              }}
            />
          ))
        )}
      </div>
    </>
  )
}

export default GameBoard
