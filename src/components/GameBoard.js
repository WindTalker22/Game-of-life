import React, { useState, useCallback, useRef } from 'react'
import produce from 'immer'
var _ = require('lodash')

const numRows = 26
const numCols = 50

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

const colors = ['#F3FE7E', '#979797', '#757575']

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
      let isGrid = false
      isGrid = false
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
              isGrid = true
              gridCopy[i][j] = 1
            }
          }
        }

        if (isGrid) {
          setGeneration((num) => num + 1)
        }

        setSum(
          gridCopy.flat().reduce((acc, cv) => {
            return acc + cv
          })
        )
      })
    })

    setTimeout(runSimulation, timeRef.current)
  }, [timeRef.current])

  return (
    <React.Fragment>
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
                    Math.random() > 0.7 ? 1 : 0
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
              setGeneration(0)
              setSum(0)
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
      <div className='InfoBox'>
        <div className='Info'>
          <p>Generation: {generation}</p>
          <p>Population: {sum}</p>
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
                backgroundColor:
                  grid[i][j] && sum > 100
                    ? _.sample(colors)
                    : grid[i][j] && sum > 75
                    ? '#F3FE7E'
                    : grid[i][j] && sum > 50
                    ? '#979797'
                    : grid[i][j] && sum >= 0
                    ? '#757575'
                    : '#000000',
                border: '1px solid #000000',
              }}
            />
          ))
        )}
      </div>
      <div className='GameDescription'>
        <div className='Description'>
          <h3>Game Description & Rules:</h3>
          <p>
            The universe of the Game of Life is an infinite, two-dimensional
            orthogonal grid of square cells, each of which is in one of two
            possible states, live or dead, (or populated and unpopulated,
            respectively). Every cell interacts with its eight neighbours, which
            are the cells that are horizontally, vertically, or diagonally
            adjacent. At each step in time, the following transitions occur:
          </p>
          <ul>
            <li>
              Any live cell with fewer than two live neighbours dies, as if by
              underpopulation.
            </li>
            <br />
            <li>
              Any live cell with two or three live neighbours lives on to the
              next generation.
            </li>
            <br />
            <li>
              Any live cell with more than three live neighbours dies, as if by
              overpopulation.
            </li>
            <br />
            <li>
              Any dead cell with exactly three live neighbours becomes a live
              cell, as if by reproduction.
            </li>
          </ul>
          <div className='GameRules'>
            <br />
            <p>
              These rules, which compare the behavior of the automaton to real
              life, can be condensed into the following:
            </p>
            <ul>
              <li>Any live cell with two or three live neighbours survives.</li>
              <br />
              <li>
                Any dead cell with three live neighbours becomes a live cell.
              </li>
              <br />
              <li>
                All other live cells die in the next generation. Similarly, all
                other dead cells stay dead.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default GameBoard
