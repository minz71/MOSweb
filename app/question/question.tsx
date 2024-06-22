"use client";
import React, { useState, useEffect, useRef } from "react";
import Rating from "../components/rating";
import Button from "../components/button";
import AudioPlayer from "../components/audioPlayer";
import "./question.css";
import { useRouter } from "next/navigation";
import axios from "axios";
import { QuestionType, AnswerType } from "./type";
import { Progress, message, Tour } from "antd";
import type { TourProps } from "antd";

const Question: React.FC = () => {
  const [btnDisable, setBtnDisable] = useState(true);
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [answers, setAnswers] = useState<AnswerType[]>([]);
  const [rate, setRate] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const [progress, setProgress] = useState(0);
  const tourRefPlay = useRef(null);
  const tourRefRate = useRef(null);
  const tourRefNext = useRef(null);
  const [openTour, setOpenTour] = useState<boolean>(true);
  const steps: TourProps["steps"] = [
    {
      title: "使用說明",
      description: "點擊播放按紐",
      target: () => tourRefPlay.current,
    },
    {
      title: "使用說明",
      description: "點擊星星評分，1 顆星代表非常不好，5 顆星代表非常好",
      target: () => tourRefRate.current,
    },
    {
      title: "使用說明",
      description: "評分完成後點擊下一題按鈕",
      target: () => tourRefNext.current,
    },
  ];
  useEffect(() => {
    if (openTour === true) {
      setBtnDisable(false);
      setStartTime(1);
    } else {
      setBtnDisable(true);
      setStartTime(0);
    }
  }, [openTour]);

  const [messageApi, contextHolder] = message.useMessage();
  const sendingMessage = () => {
    messageApi.info({
      content: "正在送出問卷資料",
      style: {
        marginTop: "5vh",
      },
    });
  };
  const sendingErrorMessage = (errMsg: string) => {
    messageApi.open({
      type: "error",
      content: errMsg,
      style: {
        marginTop: "5vh",
      },
    });
  };
  const router = useRouter();

  // Question Iterrator
  const iteratorRef = useRef<IterableIterator<QuestionType>>();
  const [currentQuestion, setCurrentQuestion] = useState<QuestionType | null>(
    null
  );
  const nextQuestion = () => {
    const next = iteratorRef.current?.next();
    if (next && !next.done) {
      next.value.filePath = next.value.filePath;
      setCurrentQuestion(next.value);
    } else {
      setIsLastQuestion(true);
    }
  };
  useEffect(() => {
    if (isLastQuestion) {
      sendingMessage();
      axios
        .post(process.env.NEXT_PUBLIC_API_URL + "/submitResult", {
          name: localStorage.getItem("userName"),
          email: localStorage.getItem("email"),
          Familiarity: Number(localStorage.getItem("familiarity")),
          audioPath: localStorage.getItem("audioPath"),
          answers: answers,
        })
        .then((response) => {
          if (response.status.toString() === "200") router.push("/complete");
        })
        .catch((error) => {
          console.error(error);
          sendingErrorMessage(
            "送出失敗，請再試一次 " + error.response.data.Msg
          );
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
        sendingErrorMessage("取得題目失敗，請再試一次");
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

  const submitQuestion = () => {
    const endTime = new Date().getTime();
    const useTime = (endTime - startTime) / 1000;
    if (useTime > 0 && startTime !== 0 && startTime !== 1) {
      saveAnswer(currentQuestion?.questionId || 0, rate, useTime);
      nextQuestion();
      setBtnDisable(true);
      setRate(0);
      setStartTime(0);
    }
  };

  const saveAnswer = (questionId: number, rate: number, useTime: Number) => {
    setAnswers([
      ...answers,
      { questionId: questionId, answerChoice: rate, timeTaken: useTime },
    ]);
  };

  // 修改進度條
  useEffect(() => {
    if (questions.length > 0) {
      setProgress(Math.floor((answers.length / questions.length) * 100));
    }
  }, [answers, questions.length]);

  return (
    <div className="sm:w-full md:w-full lg:w-9/12 xl:w-8/12">
      {contextHolder}
      <div className="">
          <Tour
            open={openTour}
            onClose={() => setOpenTour(false)}
            steps={steps}
          />
        </div>
      <div className="h-3/4 bg-gradient-to-l from-slate-300 to-slate-100 text-slate-600 border border-slate-300 p-4 rounded-lg shadow-md flex flex-col items-center justify-center space-y-10">
        <div className="mt-10 w-full max-w-xs">
          <Progress
            percent={progress}
            format={(percent) => `${percent}% 題目已完成`}
            status="active"
            strokeColor={{ from: "#A6D8E5", to: "#4491E3" }}
          />
        </div>
        <div className="w-full max-w-xl h-24 flex items-center justify-center overflow-y-auto">
        {currentQuestion && (
          <div className="text-lg capitalize text-center">
            {currentQuestion.questionId}. {currentQuestion.mandarin}
          </div>
        )}
      </div>
        <div className="flex justify-center">
          {isLoaded && (
            <AudioPlayer
              tourRef={tourRefPlay}
              audioFile={
                `${process.env.NEXT_PUBLIC_API_URL}/static${currentQuestion?.filePath}` ||
                ""
              }
              playPauseOnClick={() => {
                if (startTime === 0) {
                  const time = new Date().getTime();
                  setStartTime(time);
                }
              }}
            ></AudioPlayer>
          )}
        </div>
        <div className="flex flex-row-reverse justify-center" ref={tourRefRate}>
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
          <div className="flex justify-center" ref={tourRefNext}>
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
