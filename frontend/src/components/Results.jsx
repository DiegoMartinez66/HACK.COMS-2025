function Results({ gameData }) {
    const winnerName = gameData.winnerName;
    const tie = winnerName ? false : true;
    const initial = winnerName ? winnerName.charAt(0) : "";
    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-200 text-center">
            {tie ? (
                <div className="flex flex-col items-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">It’s a Tie!</h1>
                    <p className="text-xl text-gray-600">Both players performed .</p>
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    <div className="w-32 h-32 bg-blue-300 rounded-full flex items-center justify-center shadow-md mb-6">
                        <span className="text-5xl font-bold text-black">{initial}</span>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-1">{winnerName}</h1>
                    <p className="text-xl text-gray-600">has won the game!</p>
                </div>
            )}
        </div>
    );
}

export default Results