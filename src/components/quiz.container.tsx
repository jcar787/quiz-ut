import React, { useState, useRef, useEffect } from 'react';
import QuizView from './quiz.view';
import { questions, lsAPI } from '../utils';

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

const saveData = (key: string, score: any, seconds: number) => {
  const scoresString = lsAPI.getFromLS('quizScores');
  const scores = scoresString ? JSON.parse(scoresString) : [];

  lsAPI.saveToLS(
    'quizScores',
    JSON.stringify([...scores, { [key]: { score, seconds } }])
  );
};

const QuizContainer = (props: Iprops) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sortedQuestions, setSortedQuestions] = useState(questions);
  const [seconds, setSeconds] = useState(60);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState(Status.Start);
  const [timerStart, setTimerStart] = useState(false);
  const [initials, setInitials] = useState('');

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

    if (correctAnswer === buttonAnswer) {
      setScore((prevScore) => prevScore + 1);
    } else {
      setSeconds((prevSeconds) => prevSeconds - 5);
    }
    if (currentIndex === sortedQuestions.length - 1) {
      setTimerStart(false);
      setStatus(Status.End);
    } else {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const onClickStart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (status === Status.End) {
      saveData(initials, score, seconds);
    }

    const questions = [...sortedQuestions];
    questions.sort((a, b) => Math.random() - 0.5);
    setSortedQuestions(questions);
    setCurrentIndex(0);
    setScore(0);
    setStatus(Status.InProgress);
    setSeconds(60);
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
      initials={initials}
      setInitials={setInitials}
    />
  );
};

export default QuizContainer;
