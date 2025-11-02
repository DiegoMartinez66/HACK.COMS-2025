import PlayerBox from './PlayerBox';
import { useNavigation, useLocation, useNavigate } from 'react-router-dom';

function LobbyScreen({ gameId, gameData, isHost, startGame }) {
  if (!gameData) return;

  const isReady = gameData.joinerId !== null;

  const hostName = gameData.hostName;
  const joinerName = gameData.joinerName || 'Waiting for Opponent...';

  return (
    <div>
      <h2>Lobby {gameId}</h2>
      <p>
        Host{isHost ? '(You)' : ''}: {hostName}
      </p>
      <p>
        Opponent{isHost ? '' : '(You)'}: {joinerName}
      </p>
      {isHost ? (
        <button onClick={startGame} disabled={!isReady}>
          {isReady ? 'Start Game!' : 'Opponent has not Joined Yet'}
        </button>
      ) : (
        <p>Waiting on Host to start game</p>
      )}
    </div>
  );
}

export default LobbyScreen;
