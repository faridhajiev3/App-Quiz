import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';

function shuffleArray(array) {
  const shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

function App() {
  const [info, setInfo] = useState([])
  const [result, setResult] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  useEffect(() => {
    async function axiosData() {
      try {
        const response = await axios.get('http://localhost:3000/results');
        const data = response.data.map((item) => ({
          ...item,
          all_answers: shuffleArray([item.correct_answer, ...item.incorrect_answers])
        }));
        setInfo(data);
      } catch (error) {
        console.error('Error:', error);
      }
    }
    axiosData();
  }, []);
  // console.log(info)

  const handleAnswerClick = (questionIndex, answer) => {
    setSelectedAnswers({
      ...selectedAnswers, [questionIndex]: answer,
    })
  }
  // console.log(selectedAnswers)
  function resetQuiz() {
    setSelectedAnswers({})
    setResult(false)
  }

  return (
    <>
      <div className="quiz-app">
        <div className="quiz-header">
          <h1>Quiz App</h1>
        </div>
        <div className="quiz-main">
          {
            !result ? (
              <>
                {info.map((query, index) => (
                  <div key={index}>
                    <div className="question-container">
                      <h2 className="question">{query.question}</h2>
                    </div>
                    <div className="answers-container">
                      {
                        query.all_answers.map((answer, i) => (
                          <button
                            key={i}
                            className={`answer ${selectedAnswers[index] === answer ? "selected" : ""}`}
                            onClick={() => handleAnswerClick(index, answer)}
                          >
                            {answer}
                          </button>
                        ))
                      }
                    </div>
                  </div>
                ))}
                <button className="end" onClick={() => setResult(true)}>End</button>
              </>
            ) : (<>
              <>
                <div>
                  <h1>Sualların cavabları</h1>
                  {info.map((query, index) => (
                    <div key={index}>
                      <div className="question-container">
                        <h2 className="question">{query.question}</h2>
                      </div>
                      <div className="answers-container">
                        {query.all_answers.map((answer, i) => (
                          <button
                          key={i}
                          className={`answer ${selectedAnswers[index] === answer ? (answer === query.correct_answer ? "correct" : "incorrect") : ""}
                          ${answer === query.correct_answer ? "correct" : ""}
                          `}
                          >
                            {answer}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button className='end' onClick={resetQuiz}>Reset</button>
                </div>
              </>
            </>)
          }
        </div>
      </div>
    </>
  )
}

export default App
