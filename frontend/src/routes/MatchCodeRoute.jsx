import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/landing.css'

function MatchCodeRoute() {
  const [matchCode, setMatchCode] = useState('')
  const [playerName, setPlayerName] = useState('')
  const navigate = useNavigate()

  const handleSubmit = () => {
    setMatchCode(matchCode)
    setPlayerName(playerName)
    navigate('/login', { state: { matchCode, playerName } })
  }

  return (
    <div>
      <h1>Enter Match Code</h1>
      <input 
        type="text" 
        value={matchCode}
        onChange={(e) => setMatchCode(e.target.value)}
        placeholder='type in your Match Code' 
        />

      <input 
      type="text"
      value={playerName}
      onChange={(e) => setPlayerName(e.target.value)}
      placeholder='type in your name' 
      />
      <button onClick={handleSubmit}>Enter</button>
    </div>
  )
}

export default MatchCodeRoute
