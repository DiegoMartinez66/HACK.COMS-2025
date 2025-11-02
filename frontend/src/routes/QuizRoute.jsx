import AnswerBox from "../components/AnswerBox"

function QuizRoute(){
    return(
        <div>
            <h1>Question: </h1>
            <AnswerBox correct={true} answer={"Answer 1"}/>
            <AnswerBox corrent={false} answer={"Answer 2"}/>
            <AnswerBox correct={false} answer={"Answer 3"}/>
            <AnswerBox correct={false} answer={"Answer 4"}/>
        </div>
    )
}

export default QuizRoute