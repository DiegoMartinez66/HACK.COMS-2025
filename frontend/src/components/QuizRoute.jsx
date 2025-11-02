function QuizRoute({gameData, userId, getPlayerKey, submitAnswer }) {

  const playerKey = getPlayerKey();
  const curProgress = gameData[playerKey];
  const oppKey = playerKey === 'hostProgress' ? 'joinerProgress' : 'hostProgress';
  const oppProgress = gameData[oppKey];
  const questionObj = gameData.questions[curProgress.currentIndex];
  console.log(questionObj.options)

  const handleClick = (option) => {
    submitAnswer(option);
  }

  return (
    <div>
      <h1>Question: {questionObj.question}</h1>
      <button id='0' onClick={() => handleClick(questionObj.options[0])}>{questionObj.options[0]}</button>
      <button id='1' onClick={() => handleClick(questionObj.options[1])}>{questionObj.options[1]}</button>
      <button id='2' onClick={() => handleClick(questionObj.options[2])}>{questionObj.options[2]}</button>
      <button id='3' onClick={() => handleClick(questionObj.options[3])}>{questionObj.options[3]}</button>
    </div>
  );
}

export default QuizRoute;