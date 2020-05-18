import React from 'react';
import { Status } from './quiz.container';
import { on } from 'cluster';

interface Iquestion {
  question: string;
  answer: number;
  options: Array<string>;
}
interface Iprops {
  onClickAnswerWrapper: (
    buttonAnswer: number
  ) => (e: React.MouseEvent<HTMLButtonElement>) => void;
  onClickStart: (e: React.MouseEvent<HTMLButtonElement>) => void;
  question: Iquestion;
  status: number;
  score: number;
  seconds: number;
}

const QuizView = (props: Iprops) => {
  const {
    onClickAnswerWrapper,
    onClickStart,
    question,
    status,
    score,
    seconds,
  } = props;
  return status === Status.Start ? (
    <div className="row">
      <div className="col-12 text-center">
        <button className="btn btn-primary" onClick={onClickStart}>
          Start Quiz
        </button>
      </div>
    </div>
  ) : status === Status.InProgress ? (
    <div className="row text-center">
      <h1>Time Left: {seconds}</h1>
      <h2 className="col-12">{question.question}</h2>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        className="col-12"
      >
        {question.options.map((option, i) => {
          return (
            <button
              key={i}
              className="btn btn-primary"
              onClick={onClickAnswerWrapper(i)}
              style={{ marginTop: '5px' }}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  ) : (
    <div className="row text-center">
      <h1 className="col-12">Your score is: {score}</h1>
      <h1 className="col-12">You completed the quiz in: {seconds}</h1>
    </div>
  );
};

export default QuizView;
