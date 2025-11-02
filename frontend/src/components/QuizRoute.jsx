function QuizRoute({gameData, userId, getPlayerKey, submitAnswer }) {

  const playerKey = getPlayerKey();
  const curProgress = gameData[playerKey];
  const oppKey = playerKey === 'hostProgress' ? 'joinerProgress' : 'hostProgress';
  const oppProgress = gameData[oppKey];
  const questionObj = gameData.questions[curProgress.currentIndex];
  const totalQuestions = gameData.questions.length;

  const myPercent = Math.round((curProgress.correctCount / totalQuestions) * 100);
  const oppPercent = Math.round((oppProgress.correctCount / totalQuestions) * 100);

  const handleClick = (option) => {
    submitAnswer(option);
  }

  return (
    <div>
      <h1>Question {curProgress.currentIndex+1}: {questionObj.question}</h1>
      <button id='0' onClick={() => handleClick(questionObj.options[0])}>{questionObj.options[0]}</button>
      <button id='1' onClick={() => handleClick(questionObj.options[1])}>{questionObj.options[1]}</button>
      <button id='2' onClick={() => handleClick(questionObj.options[2])}>{questionObj.options[2]}</button>
      <button id='3' onClick={() => handleClick(questionObj.options[3])}>{questionObj.options[3]}</button>
      <h3>Your Progress: {myPercent}%</h3>
      <progress value={myPercent} max="100"/>
      <h3>Opponent Progress: {oppPercent}%</h3>
      <progress value={oppPercent} max="100"/>
    </div>
  );
}

export default QuizRoute;