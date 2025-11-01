import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

function JoinRoute(){
    const location = useLocation()
    const playerName = location.state?.playerName

    const [matchCode, setMatchCode] = useState('')

    const navigate = useNavigate()

    const handleSubmit = () => {
        navigate('/login', { state: { matchCode, playerName }})
    }
    
    
    return(
        <div>
            <h1>Enter Game ID</h1>
            <input 
            type="text"
            value={matchCode}
            onChange={(e) => setMatchCode(e.target.value)} 
            placeholder='enter in the game id'
            />

            <button onClick={handleSubmit}>Join</button>
        </div>
    )
}

export default JoinRoute