"use client";
import React, { useState, useEffect, useRef } from "react";
import Rating from "../components/rating";
import Button from "../components/button";
import AudioPlayer from "../components/audioPlayer";
import { useRouter } from "next/navigation";
import axios from "axios";
import { QuestionType, AnswerType } from "./type";
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import { Console } from "console";
interface State extends SnackbarOrigin {
  open: boolean;
}
const Question: React.FC = () => {
  const [btnDisable, setBtnDisable] = useState(true);
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [answers, setAnswers] = useState<AnswerType[]>([]);
  const [rate, setRate] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [toastMessage, setToastMessage] = useState("正在送出問卷資料");
  const [isLastQuestion, setIsLastQuestion] = useState(false);

  const [state, setState] = React.useState<State>({
    open: false,
    vertical: "bottom",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = state;
  const router = useRouter();

  // Question Iterrator
  const iteratorRef = useRef<IterableIterator<QuestionType>>();
  const [currentQuestion, setCurrentQuestion] = useState<QuestionType | null>(
    null
  );
  const nextQuestion = () => {
    const next = iteratorRef.current?.next();
    if (next && !next.done) {
      next.value.filePath = "assets" + next.value.filePath;
      setCurrentQuestion(next.value);
    } else {
      setIsLastQuestion(true);
    }
  };
  useEffect(() => {
    if (isLastQuestion) {
      setState({ ...state, open: true });
      setToastMessage("正在送出問卷資料");
      axios
        .post(process.env.NEXT_PUBLIC_API_URL + "/submitResult", {
          name: localStorage.getItem("userName"),
          email: localStorage.getItem("email"),
          Familiarity: Number(localStorage.getItem("familiarity")),
          answers: answers,
        })
        .then((response) => {
          if (response.status.toString() === "200") router.push("/complete");
        })
        .catch((error) => {
          console.error(error);
          setToastMessage("送出失敗，請再試一次 " + error.response.data.Msg);
          setState({ ...state, open: true });
        });
    }
  }, [isLastQuestion]);

  useEffect(() => {
    axios
      .get(process.env.NEXT_PUBLIC_API_URL + "/AllQuestions")
      .then((response) => {
        setQuestions(response.data.Data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // 單獨處理問題數據變化事件
  useEffect(() => {
    if (isLoaded) {
      iteratorRef.current = questions[Symbol.iterator]();
    }
  }, [isLoaded, questions]);

  // 單獨處理下一個事件
  useEffect(() => {
    if (isLoaded && currentQuestion === null) {
      nextQuestion();
    }
  }, [isLoaded, currentQuestion, nextQuestion]);

  useEffect(() => {
    if (questions.length > 0) {
      setIsLoaded(true);
    }
  }, [questions]);

  const saveAnswer = (questionId: number, rate: number, useTime: Number) => {
    setAnswers([
      ...answers,
      { questionId: questionId, answerChoice: rate, timeTaken: useTime },
    ]);
  };

  const submitQuestion = () => {
    const endTime = new Date().getTime();
    const useTime = (endTime - startTime) / 1000;
    if (useTime > 0 && startTime !== 0) {
      saveAnswer(currentQuestion?.questionId || 0, rate, useTime);
      nextQuestion();
      setBtnDisable(true);
      setRate(0);
      setStartTime(0);
    }
  };
  const handleToastClose = () => {
    setState({ ...state, open: false });
  };
  return (
    <div className="sm:w-full md:w-full lg:w-9/12 xl:w-8/12">
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleToastClose}
        message={toastMessage}
        key={vertical + horizontal}
      />
      <div className="h-3/4 bg-gradient-to-l from-slate-300 to-slate-100 text-slate-600 border border-slate-300 grid grid-col-1 justify-center p-4 gap-10 rounded-lg shadow-md">
        <div className="mt-10 col-span-1 text-lg capitalize rounded-md flex flex-row-reverse justify-center">
          {currentQuestion?.questionId}. {currentQuestion?.mandarin}
        </div>
        <div className="flex justify-center">
          {isLoaded && (
            <AudioPlayer
              audioFile={currentQuestion?.filePath || ""}
              playPauseOnClick={() => {
                if (startTime === 0) {
                  const time = new Date().getTime();
                  setStartTime(time);
                }
              }}
            ></AudioPlayer>
          )}
        </div>
        <div className="flex flex-row-reverse justify-center">
          <Rating
            disabled={startTime === 0}
            isFixed={false}
            rate={rate}
            onchange={(event) => {
              setBtnDisable(false);
              setRate(parseInt(event.target.value));
            }}
          />
        </div>
        <div className="col-span-1">
          <div className="flex justify-center">
            <Button
              text="下一題"
              disabled={btnDisable}
              onClick={() => {
                submitQuestion();
              }}
            ></Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Question;
