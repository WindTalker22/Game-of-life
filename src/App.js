import React from 'react'
import './App.css'
import GameBoard from './components/GameBoard'

function App() {
  return (
    <div>
      <h1 className='Title'>Conways Game Of Life</h1>
      <GameBoard />
    </div>
  )
}

export default App
