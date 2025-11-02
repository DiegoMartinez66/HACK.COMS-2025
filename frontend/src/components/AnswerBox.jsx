import QuizRoute from "./QuizRoute"

function AnswerBox({ correct, answer }){
    const handleSubmit = () => {
        if(correct){
            alert("Correct")

        } else{
            alert("False")
        }
    }
    
    return(
        <div>
            <button onClick={handleSubmit}>{answer}</button>
        </div>
    )
}

export default AnswerBox