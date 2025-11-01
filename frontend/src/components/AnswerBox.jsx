function AnswerBox({ correct, answer }){
    const handleSubmit = () => {
        if(correct){
            //whatever code for right answer
        } else{
            //whatever code for wrong answer
        }
    }
    
    return(
        <div>
            <button onClick={handleSubmit}>{answer}</button>
        </div>
    )
}

export default AnswerBox