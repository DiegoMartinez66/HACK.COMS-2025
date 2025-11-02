import PlayerBox from './PlayerBox';
import { useState } from 'react';

function LobbyScreen({ gameId, gameData, isHost, startGame, setUploadedFile, handleGenerateQuiz, quizGen }) {
  if (!gameData) return;

  const isReady = gameData.joinerId !== null;

  const hostName = gameData.hostName;
  const joinerName = gameData.joinerName || 'Waiting for Opponent...';

  const [file, setFile] = useState(null);
  
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    if (typeof setUploadedFile === 'function') setUploadedFile(f);
  };

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
        <>
        <form onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="documentUpload">Select a document:</label>
              <input
                type="file"
                id="documentUpload"
                name="document"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
              />
            </form>
          {!file ? (
            <div>
              <p>Please upload a file</p>
            </div>
          ) : (
            <div>
              <p>File uploaded: {file.name}</p>
              <button onClick={handleGenerateQuiz}>Generate Quiz from File (Gemini)</button>
            </div>
          )}

          <button onClick={startGame} disabled={!isReady || !file || !quizGen} className='text-2xl'>
            {isReady && file ? 'Start Game!' : 'Opponent has not Joined Yet or File is not Uploaded'}
          </button>
        </>
      ) : (
        <p>Waiting on Host to start game</p>
      )}
      
      </div>
    
    </div>
  );
}

export default LobbyScreen;
