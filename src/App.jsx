import { useState,useEffect,useRef, forceUpdate } from 'react'
import Question from './components/Question';
import { nanoid } from 'nanoid'
import './App.css';

export default function App() {

const [isGameStart, setGameStart] = useState(false)
const [questions, setQuestions] = useState([])
const [renderTimes, setRenderTimes] = useState(0)
const dataFetchedRef = useRef(false)
const [isPlayed, setIsPlayed] = useState(false)
console.log(questions)

const [correctAnswers, setCorrectAnswers] = useState(0)

const questionsElements = questions.map(question => {

  return(

  <Question
  key={question.id}
  id={question.id}
  question={question.question}
  answer={question.answer}
  correct_answer={question.correct_answer}
  allAnswers={question.allAnswers}
  handleClick={holdAnswer}
  
  />
)

})


function holdAnswer(id, question){
  console.log("clicked on answer")
  let newArray = questions
  for(let i=0 ; i<newArray.length ; i++){
    for(let k=0 ; k<newArray[i].allAnswers.length ; k++){
      if (newArray[i].allAnswers[k].id === id){
        newArray[i].allAnswers[k] = {...newArray[i].allAnswers[k], isHeld: !newArray[i].allAnswers[k].isHeld}
      }
      if (newArray[i].allAnswers[k].question === question && 
        newArray[i].allAnswers[k].id != id){
          newArray[i].allAnswers[k] = {...newArray[i].allAnswers[k], isHeld: false}
        }
      
  }}
setRenderTimes(old => old + 1)
setQuestions(newArray)
  }
   

useEffect(() => {
  if (dataFetchedRef.current) return;
      dataFetchedRef.current = true;
      getQuestions()
  
  },[])

function getQuestions(){

  fetch("https://opentdb.com/api.php?amount=5")
  .then(response => response.json())
  .then(data => {
    const newQustions = data.results.map(question => {
      
      const incorrectAnswers = question.incorrect_answers
      const randomIndex = Math.floor(Math.random() * (question.incorrect_answers.length + 1));
      let allAnswers = [
        ...incorrectAnswers.slice(0, randomIndex),
        question.correct_answer,
        ...incorrectAnswers.slice(randomIndex)]

      allAnswers = allAnswers.map(answer => {
    
          return{
            id: nanoid(),
            question: question.question,
            value: answer,
            isHeld: false,
            isCorrect: false,
            isIncorrect: false,
            isNotChosen: false
          }
        })
    return {
      id: nanoid(),
      question: question.question,
      answer: question.correct_answer,
      allAnswers: allAnswers
      
    }
})
setQuestions(newQustions)

})

}

function finish(){
  
  if(isPlayed === false){
    let newArray = questions
    for (let i = 0; i < newArray.length; i++) {
      for(let k = 0; k < newArray[i].allAnswers.length; k++) {
        if (newArray[i].allAnswers[k].value === newArray[i].answer){
          newArray[i].allAnswers[k].isCorrect = true
          if(newArray[i].allAnswers[k].isHeld === true){
            setCorrectAnswers(old => old + 1)
          }
          newArray[i].allAnswers[k].isHeld = false
        }
        if (newArray[i].allAnswers[k].isHeld === true && newArray[i].allAnswers[k].value != newArray[i].answer ){
          newArray[i].allAnswers[k].isIncorrect = true
        }else if (newArray[i].allAnswers[k].value != newArray[i].answer){
          newArray[i].allAnswers[k].isNotChosen = true
        }
      }
    }
  setIsPlayed(true)
  document.getElementById("scoreText").className = "isVisible"
  setRenderTimes(old => old + 1)
  setQuestions(newArray)

  }else {
    setIsPlayed(false)
    setCorrectAnswers(0)
    document.getElementById("scoreText").className = "notVisible"
    getQuestions()
  }
}


  return (

    <main>
      <div className="container">
      {
        isGameStart
          ?
          <>
            <div>
              {questionsElements}
            </div>
          
          <div className="finish_container">
            <h4
              id="scoreText"
              className="notVisible"
              >
                You Scored {correctAnswers}/5 correct answers
            </h4>
            <button
              className="finish_btn"
              onClick={finish}
              >
                {isPlayed ? "Play Again" : "Check Answers"}
            </button>
          </div>
          </>
          :
          <div className="frontPage">
          <h1 className="gameHeader">Quizical</h1>
          <h4 className="codedBy">Coded by Ido Strassberg</h4>
          <button className="startQuizBtn" onClick={() => setGameStart(true)}>Start quiz</button>
          </div>
      }
      </div>
    </main>
    
    
  );
}