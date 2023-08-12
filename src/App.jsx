import { useState,useEffect,useRef, forceUpdate } from 'react'
import Question from './components/Question';
import { nanoid } from 'nanoid'
import './App.css';
import { FiMenu } from "react-icons/fi";

export default function App() {

const [isGameStart, setGameStart] = useState(false)
const [questions, setQuestions] = useState([])
const [renderTimes, setRenderTimes] = useState(0)
const dataFetchedRef = useRef(false)
const [isPlayed, setIsPlayed] = useState(false)
console.log(questions)
const [isAllAnswersHeld, setIsAllAnswersHeld] = useState(false)
const [correctAnswers, setCorrectAnswers] = useState(0)
const [apiData, setApiData] = useState(
  {numPick: "5", diffPick: "", catPick: ""}
)
const [categoryList, setCategoryList] = useState([])

function handleChange(event) {
  setRenderTimes(old => old + 1)
  setApiData(prevApiData => {
    return {
      ...prevApiData,
      [event.target.name]: event.target.value
    }
  })
}

function handleChangeNum(event) {
  setRenderTimes(old => old + 1)
  setApiData(prevApiData => {
    if(event.target.value != ""){
      if(parseInt(event.target.value) < parseInt(event.target.min)){
        return {
          ...prevApiData,
          [event.target.name]: event.target.min
        }
      }
      if(parseInt(event.target.value) > parseInt(event.target.max)){
        return {
          ...prevApiData,
          [event.target.name]: event.target.max
        }
      }
    }
    return{
      ...prevApiData,
          [event.target.name]: event.target.value
    }
    
  })
  
}




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

const catEllements = categoryList.map(cat => {
  return(
    <option key={cat.key} value={cat.id}>{cat.name}</option>
  )
})


function holdAnswer(id, question){
  console.log("clicked on answer")
  let newArray = questions
  for(let i=0 ; i<newArray.length ; i++){
    for(let k=0 ; k<newArray[i].allAnswers.length ; k++){
      if (newArray[i].allAnswers[k].id === id){
        newArray[i].allAnswers[k] = {...newArray[i].allAnswers[k], isHeld: !newArray[i].allAnswers[k].isHeld}
        newArray[i].isAnswerHeld = true
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

  getCategories()

},[])

function getCategories(){

  const catURL = `https://opentdb.com/api_category.php`
  fetch(catURL)
  .then(response => response.json())
  .then(data => {
    const newCatList = data.trivia_categories.map(cat =>{
      return{
        key: nanoid(),
        id: cat.id,
        name: cat.name
      }
    })
    setCategoryList(newCatList)
  })
}
   

useEffect(() => {
  if (isGameStart === true) {
    if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;
        getQuestions()
  }
  
  },[isGameStart])

function getQuestions(){
  const URL = `https://opentdb.com/api.php?amount=${apiData.numPick}&category=${apiData.catPick}&difficulty=${apiData.diffPick}`
  console.log(URL)
  fetch(URL)
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
      allAnswers: allAnswers,
      isAnswerHeld: false
      
    }
})
setQuestions(newQustions)

})

}

function scrollToTop(){
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth"
  }
)}

function finish(){
  
  if(isPlayed === false){
    let newArray = questions
    let numAnswersHeld = 0
    for (let i = 0; i < newArray.length; i++) {
      if(newArray[i].isAnswerHeld === true){
        numAnswersHeld ++
      }
    }
    if(numAnswersHeld == apiData.numPick){
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
  setIsAllAnswersHeld(true)  
  setIsPlayed(true)
  document.getElementById("scoreText").className = "isVisible"
  setRenderTimes(old => old + 1)
  setQuestions(newArray)
    }else{
      setIsAllAnswersHeld(false)
      document.getElementById("scoreText").className = "isVisible"
      setRenderTimes(old => old + 1)
    }
  }else {
    setIsAllAnswersHeld(false)
    setIsPlayed(false)
    setCorrectAnswers(0)
    document.getElementById("scoreText").className = "notVisible"
    getQuestions()
    scrollToTop()
  }
}

function returnMenu(){
  setGameStart(false)
  setIsPlayed(false)
  dataFetchedRef.current = false
  setCorrectAnswers(0)
  setQuestions([])
  setApiData({numPick: "5", diffPick: "", catPick: ""})
  setRenderTimes(old => old + 1)
}


  return (

    <main>
      <div className="container">
      {
        isGameStart
          ?
          <>
            <FiMenu onClick={returnMenu}/>
            <div>
              {questionsElements}
            </div>
          
          <div className="finish_container">
            <h4
              id="scoreText"
              className="notVisible"
              >
                {isAllAnswersHeld ? `You Scored ${correctAnswers}/${apiData.numPick} correct answers` : `Please choose all answers`}
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
          <div className='pickers'>
            <h5 className='lable'>Choose Difficulty</h5>
            <select className="input" name="diffPick" value={apiData.diffPick} onChange={handleChange}>
              <option value="">Any Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <h5 className='lable'>Choose Category</h5>
            <select className="input" name="catPick" value={apiData.catPick} onChange={handleChange}>
            <option value="">Any Category</option>
              {catEllements}
            </select>
            <h5 className='lable'>Choose the number of questions</h5>
            <input className="input" type="number" name="numPick" min="1" max="50" value={apiData.numPick} onChange={handleChangeNum}></input>
          </div>
          <button className="startQuizBtn" onClick={() => {setGameStart(true);setRenderTimes(old => old + 1)}}>Start quiz</button>
          </div>
      }
      </div>
    </main>
    
    
  );
}