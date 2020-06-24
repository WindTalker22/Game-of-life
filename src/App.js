import React from 'react'
import './App.css'
import GameBoard from './components/GameBoard'
import Space from './video/401532737.mp4'

function App() {
  return (
    <div>
      {/* <video
        autoPlay
        loop
        muted
        style={{
          position: 'fixed',
          width: '100%',
          left: '50%',
          top: '50%',
          height: '100vh',
          objectFit: 'cover',
          transform: 'translate(-50%,-50%)',
          zIndex: '-1',
        }}
      >
        <source src={Space} />
      </video> */}
      <h1 className='Title'>Conways Game Of Life</h1>
      <GameBoard />
    </div>
  )
}

export default App
