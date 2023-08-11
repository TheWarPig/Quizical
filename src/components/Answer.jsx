import { useState,useEffect,useRef } from 'react'
import './Question.css';
import {decode} from 'html-entities';

export default function Answer(props){

    const [isHeld, setIsHeld] = useState(false)

   
    const held = props.isHeld ? "held" : ""

    const correct = props.isCorrect ? "correct" : ""

    const incorrect = props.isIncorrect ? "incorrect" : ""

    const notChosen = props.isNotChosen ? "notChosen" : ""

    const classes = `answer ${correct} ${held} ${incorrect} ${notChosen}`
    return (
 
        <button

            className={classes}
            onClick={() => {props.handleClick(props.id, props.question); setIsHeld(prevIsHeld => !prevIsHeld)}}
            >
            {decode(props.value, {level: 'html5'})}
            
        </button>
    

    )


}