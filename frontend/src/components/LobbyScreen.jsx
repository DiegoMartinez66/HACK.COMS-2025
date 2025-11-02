import PlayerBox from './PlayerBox';
import { useNavigation, useLocation, useNavigate } from 'react-router-dom';

function LobbyScreen({ gameId, gameData, isHost, startGame }) {
  if (!gameData) return;

  const isReady = gameData.joinerId !== null;

  const hostName = gameData.hostName;
  const joinerName = gameData.joinerName || 'Waiting for Opponent...';

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      
      <div className="flex flex-col">
      
      <h2 className='font-semibold text-4xl pb-3 text-center'>Lobby {gameId}</h2>
      
      <div className='bg-red-400 flex flex-col'>
        <p className='text-2xl flex pl-4'>
          Host{isHost ? '(You)' : ''}: {hostName}
        </p>
      </div>

      <div className='pb-6'></div>
      
      <div className='bg-blue-400 flex flex-col'>
        <p className='text-2xl pl-4'>
          Opponent{isHost ? '' : '(You)'}: {joinerName}
        </p>
      </div>

      <div className='pt-5'></div>

      {isHost ? (
        <button onClick={startGame} disabled={!isReady} className='text-2xl'>
          {isReady ? 'Start Game!' : 'Opponent has not Joined Yet'}
        </button>
      ) : (
        <p>Waiting on Host to start game</p>
      )}
      
      </div>
    
    </div>
  );
}

export default LobbyScreen;
