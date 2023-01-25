import React from "react";

export default function Card(props) {

    function activeClass(currentIndex) {
        let indexQuestion;
        for (let i=0; i < props.cardsData.length; i++) {
            if (props.cardsData[i].question === props.question) {
                indexQuestion = i;
            }
        }

        if (props.gameOver) {
            if (currentIndex === props.correctAnswerIndex) {
                return "green-option";
            } else if (props.activeState[indexQuestion].indexClicked !== props.correctAnswerIndex && currentIndex === props.activeState[indexQuestion].indexClicked){
                    return "red-option";
            }
        } else {
            if (props.activeState[indexQuestion].active && props.activeState[indexQuestion].indexClicked === currentIndex) {
                return "active-option";
            } else if (props.activeState[currentIndex].indexClicked === currentIndex) {
                return "";
            }
        }
    }

    const allOptionsJSX = props.allOptions[0].map((option, index) => {
        if (index === 0) {
            return <div onClick={() => props.selectOption(props.id, index)} className={`option first-option ${activeClass(index)}`}>{option}</div>
        } else {
            return <div onClick={() => props.selectOption(props.id, index)} className={`option ${activeClass(index)}`}>{option}</div>
        }
    })

    return (
        <section>
            <h2 className="question">{props.question}</h2>
            <div className="options-container">
                {allOptionsJSX}
            </div>
        </section>
    )
}