import React from "react";
import Divider from '@mui/material/Divider';
import './Question.css';
import {decode} from 'html-entities';
import Answer from "./Answer";

export default function Question(props) {

  

  const answerElements = props.allAnswers.map((answer) => {

    return(
      <Answer 
      key = {answer.id}
      id = {answer.id}
      question = {props.question}
      value = {answer.value}
      isHeld = {answer.isHeld}
      isCorrect = {answer.isCorrect}
      isIncorrect = {answer.isIncorrect}
      isNotChosen = {answer.isNotChosen}
      handleClick = {props.handleClick}

    
    />
    )
  })

  return (

    <div>
        <h2 className="question">{decode(props.question, {level: 'html5'})}</h2>
        <div className="answers-container">
          {answerElements}
        </div>
        <Divider className="divider"/>
    </div>
    
  );
}