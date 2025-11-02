import AnswerBox from "./AnswerBox";

function QuizRoute({ question, a1, a2, a3, a4 }) {
  const correctAnswer = a1

  const answerArray = [a1, a2, a3, a4].filter(Boolean)

  const pool = [...answerArray]

  const pickRandom = () => pool.splice(Math.floor(Math.random() * pool.length), 1)[0]

  const v1 = pickRandom()
  const v2 = pickRandom()
  const v3 = pickRandom()
  const v4 = pickRandom()

  return (
    <div>
      <h1>Question: {question}</h1>
      {<AnswerBox correct={v1 === correctAnswer} answer={v1} />}
      {<AnswerBox correct={v2 === correctAnswer} answer={v2} />}
      {<AnswerBox correct={v3 === correctAnswer} answer={v3} />}
      {<AnswerBox correct={v4 === correctAnswer} answer={v4} />}
    </div>
  );
}

export default QuizRoute;