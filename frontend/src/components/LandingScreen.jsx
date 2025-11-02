import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LandingScreen({
  createGame,
  joinGame,
  gameIdInput,
  setGameIdInput,
  userName,
  setUserName,
}) {

  return (
    <div>
      <input
        type="text"
        placeholder="Your Name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      ></input>
      <button onClick={createGame} disabled={!userName}>Create New Game (Host)</button>
      <input
        type="text"
        placeholder="Enter Game Id to Join"
        value={gameIdInput}
        onChange={(e) => setGameIdInput(e.target.value)}
      ></input>
      <button
        onClick={joinGame}
        disabled={!gameIdInput || gameIdInput.length !== 6 || !userName}
      >
        Join Game
      </button>
    </div>
  );
}

export default LandingScreen;
