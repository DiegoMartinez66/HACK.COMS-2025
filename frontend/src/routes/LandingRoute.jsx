import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function LandingRoute() {
  const [playerName, setPlayerName] = useState('')
  const navigate = useNavigate()

  const handleSubmitCreate = () => {
    setPlayerName(playerName)
    navigate('/create', { state: { playerName } })
  }

  const handleSubmitJoin = () => {
    setPlayerName(playerName)
    navigate('/join', { state: { playerName } })
  }

  return (
    <div>
      <h1>Quiz Race</h1>
      <input 
      type="text"
      value={playerName}
      onChange={(e) => setPlayerName(e.target.value)} 
      placeholder='type in your name'
      />
      
      <button onClick={handleSubmitCreate}>Create</button>
      <button onClick={handleSubmitJoin}>Join</button>
    </div>
  )
}

export default LandingRoute
