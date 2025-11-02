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
    <div>
      <h2>Lobby {gameId}</h2>
      <p>
        Host{isHost ? '(You)' : ''}: {hostName}
      </p>
      <p>
        Opponent{isHost ? '' : '(You)'}: {joinerName}
      </p>

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

          <button onClick={startGame} disabled={!isReady || !file || !quizGen}>
            {isReady && file ? 'Start Game!' : 'Opponent has not Joined Yet or File is not Uploaded'}
          </button>
        </>
      ) : (
        <p>Waiting on Host to start game</p>
      )}
    </div>
  );
}

export default LobbyScreen;
