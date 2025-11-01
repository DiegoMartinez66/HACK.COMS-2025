import PlayerBox from "../components/PlayerBox"
import { useNavigation, useLocation, useNavigate } from 'react-router-dom'

function LoginRoute(){
    const location = useLocation()
    const matchCode = location.state?.matchCode
    const playerName = location.state?.playerName

    const navigate = useNavigate()

    const handleSubmit = () => {
        navigate('/quiz')
    }

    return(
        <div>
            <h1>Match Code: {matchCode}</h1>
            <PlayerBox playerName={playerName}/>
            <button onClick={handleSubmit}>Start</button>
        </div>
    )
}

export default LoginRoute