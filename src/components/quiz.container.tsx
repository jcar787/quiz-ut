import React, { useState, useCallback, useRef, useEffect } from 'react';
import QuizView from './quiz.view';
import { questions } from '../utils';

interface Iprops {}
export enum Status {
  Start = -1,
  InProgress,
  End,
}

const useInterval = (cb: any, delay: number | null) => {
  const savedCb = useRef();

  useEffect(() => {
    savedCb.current = cb;
  }, [cb]);

  useEffect(() => {
    function tick() {
      // @ts-ignore
      savedCb.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};
const QuizContainer = (props: Iprops) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sortedQuestions, setSortedQuestions] = useState(questions);
  const [seconds, setSeconds] = useState(60);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState(Status.Start);

  const [timerStart, setTimerStart] = useState(false);

  useInterval(
    () => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    },
    timerStart ? 1000 : null
  );

  const onClickAnswerWrapper = (correctAnswer: number) => (
    buttonAnswer: number
  ) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(correctAnswer, buttonAnswer);
    if (correctAnswer === buttonAnswer) {
      setScore((prevScore) => prevScore + 1);
    } else {
      setSeconds((prevSeconds) => prevSeconds - 5);
      if (currentIndex === sortedQuestions.length - 1) {
        setTimerStart(false);
        setStatus(Status.End);
      } else {
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }
    }
  };

  const onClickStart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setScore(0);
    setStatus(Status.InProgress);

    const questions = [...sortedQuestions];
    questions.sort((a, b) => Math.random() - 0.5);
    setSortedQuestions(questions);
    setTimerStart(true);
  };

  return (
    <QuizView
      onClickAnswerWrapper={onClickAnswerWrapper(
        sortedQuestions[currentIndex].answer
      )}
      onClickStart={onClickStart}
      question={sortedQuestions[currentIndex]}
      status={status}
      score={score}
      seconds={seconds}
    />
  );
};

export default QuizContainer;
