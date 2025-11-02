function Results( {gameData} ){
    const winnerName = gameData.winnerName;
    const tie = winnerName ? false : true;
    return(
        <div>
            {tie ? <h1>The game ended in a tie!</h1> : <h1>{winnerName} has won the game!</h1>}
        </div>
    );
}

export default Results