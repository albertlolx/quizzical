import React from "react";
import Settings from "./components/Settings";
import Card from "./components/Card";

const resetSelectedOptions = {0: {
  indexClicked: null,
  active: false
}, 1: {
  indexClicked: null,
  active: false
}, 2: {
  indexClicked: null,
  active: false
}, 3: {
  indexClicked: null,
  active: false
}, 4: {
  indexClicked: null,
  active: false
}}

export default function App() {

  const [score, setScore] = React.useState(0);
  const [gameFinish, setGameFinish] = React.useState(false);
  const [cardsData, setCardsData] = React.useState({});
  const [restartGame, setRestartGame] = React.useState(false);
  const [displaySettings, setDisplaySettings] = React.useState(false);
  const [selectedOptions, setSelectedOptions] = React.useState({0: {
          indexClicked: null,
          active: false
        }, 1: {
          indexClicked: null,
          active: false
        }, 2: {
          indexClicked: null,
          active: false
        }, 3: {
          indexClicked: null,
          active: false
        }, 4: {
          indexClicked: null,
          active: false
  }});

  function getOptions(type, element) {

    if (type === "category" && element !== null) {
      return element.value;
    } else if (type === "category" && element === null) {
      return "10";
    } else if (type === "difficulty" && element !== null) {
      return element.value;
    } else if (type === "difficulty" && element === null) {
      return "easy";
    }
  }

  const categoryOptions = getOptions("category", document.getElementById("category-options"));
  const difficultyOptions = getOptions("difficulty", document.getElementById("difficulty-options"));

  const BASE_API_URL = `https://opentdb.com/api.php?amount=5&category=${categoryOptions}&difficulty=${difficultyOptions}&type=multiple&encode=base64`;

  function UnicodeDecodeB64(str) {
    return decodeURIComponent(atob(str));
  }

  function getRandomKey() {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 10; i++) {
        result += characters[Math.floor(Math.random() * characters.length)];
    }
    return result;
  }

  React.useEffect(() => {

    fetch(BASE_API_URL)
      .then((res) => res.json())
      .then((data) => {
        setCardsData(() => {
          const newData = data.results.map((card, index) => {
            const incorrectAnswers = data.results[index].incorrect_answers.map((answer) => {
              return UnicodeDecodeB64(answer);
            })

            const randomNumber = Math.floor(Math.random() * 3);

            const correctAnswer = UnicodeDecodeB64(data.results[index].correct_answer)

            const allOptions = incorrectAnswers;
            allOptions.splice(randomNumber, 0, correctAnswer);
            const id = getRandomKey();
            
            return {
                correctAnswer: [correctAnswer],
                correctAnswerIndex : randomNumber,
                allOptionsArry: [allOptions],
                question: [UnicodeDecodeB64(data.results[index].question)],
                id: [id]
            }
          })

          return newData;
        })
      })
      if (selectedOptions !== resetSelectedOptions) {
        setSelectedOptions(resetSelectedOptions);
      }

      setScore(0);
      setGameFinish(false);

  }, [restartGame])

  function selectOption(id, indexClicked) {
    setSelectedOptions((prevArry) => {
      let correctanswer;
      let indexQuestion;
      for (let i=0; i < cardsData.length; i++) {
        if (cardsData[i].id === id) {
          correctanswer = cardsData[i].correctAnswer;
          indexQuestion = i;
        }
      }

      const newActive =  !prevArry[indexQuestion].active;

      return {
        ...prevArry,
        [indexQuestion]: {
          indexClicked: indexClicked,
          active: newActive,
          correct_answer: correctanswer[0]
        }
      }
    })
  }

  let allCards = "";
  
  if (cardsData.length === 5) {

    allCards = cardsData.map((card) => {
      return (
        <Card
          question={card.question}
          allOptions={card.allOptionsArry}
          key={card.id}
          id={card.id}
          selectOption={selectOption}
          activeState={selectedOptions}
          cardsData={cardsData}
          gameOver={gameFinish}
          correctAnswerIndex={card.correctAnswerIndex}
        />
      ) 
    })
  }

  function renderScore() {
    let count = 0;
    let totalScore = 0;
    
    if (gameFinish) {
      setRestartGame((prev) => {
        return !prev;
      })

    } else {
      for (let i=0; i < 5; i++) {
        let correctAnswerIndex = cardsData[i].correctAnswerIndex;
        if (selectedOptions[i].active) {
          count++;
      
          if (correctAnswerIndex === selectedOptions[i].indexClicked) {
            totalScore++;
          }
        }
      }
    }

    if (count === 5) {
      setScore(totalScore);
      setGameFinish(true)
    } else if (selectedOptions === resetSelectedOptions){
      alert("Select all of your answers to continue!");
    }
  }

  function renderSettings() {
    setDisplaySettings((prev) => {
      return !prev;
    })
    setRestartGame((prev) => {
      return !prev;
    })
  }
  
  if (displaySettings) {
    return (
      <main className="settings-background">
        <Settings key={getRandomKey()} />
        <button onClick={renderSettings}className="back-btn"></button>
      </main>
    )
  } else {
    return (
      <main>
        <div className="container">
          {allCards}
          <div className="button-container">
            <button onClick={renderScore} className="check-answers-btn">{gameFinish ? "Play Again": "Check Answers"}</button>
            <button onClick={renderSettings}className="settings-btn"></button>
          </div>
          {gameFinish ? <h2 className="score">You Scored: {score} / 5!</h2>: ""}
        </div>
      </main>
    );
  }
}