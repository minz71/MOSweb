"use client";
import React, { useState, useEffect, useRef } from "react";
import Button from "../components/button";
import { useRouter } from "next/navigation";

const AudioRecorder: React.FC = () => {
  const [isGranted, setIsGranted] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const router = useRouter();
  useEffect(() => {
    checkRecordingPermission();
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (isRecording) {
      startRecording();
      intervalId = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      stopRecording();
      if (intervalId) {
        clearInterval(intervalId);
      }
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRecording]);

  const checkRecordingPermission = async (): Promise<boolean> => {
    try {
      const permissionStatus = await navigator.permissions.query({
        name: "microphone" as PermissionName,
      });
      setIsGranted(permissionStatus.state === "granted");
      return permissionStatus.state === "granted";
    } catch (error) {
      console.error("Error checking recording permission:", error);
      setIsGranted(false);
      return false;
    }
  };

  const startRecording = async () => {
    setAudioBlob(null);
    setRecordingTime(0);
    if (!isGranted) {
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      setAudioBlob(audioBlob);
    };

    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  const handleRecordClick = () => {
    setIsRecording((prevState) => !prevState);
  };

  const handleUploadClick = () => {
    if (audioBlob) {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.wav");

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploadAudio`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem("audiofile", data.Data);
          router.push("/question");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const handlePlayClick = () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  return (
    <div className="sm:w-full md:w-full lg:w-9/12 xl:w-8/12">
      <div className="h-3/4 bg-gradient-to-l from-slate-300 to-slate-100 text-slate-600 border border-slate-300 grid grid-col-1 justify-center p-4 gap-10 rounded-lg shadow-md">
        <div className="col-span-1 text-lg capitalize rounded-md flex flex-row-reverse justify-center">
          {isGranted ? "" : "請先允需錄音權限，然後點擊開始錄音按鈕。"}
        </div>
        <div className="col-span-1 text-lg capitalize rounded-md flex flex-row-reverse justify-center">
          請錄製以下語音：「測試測試測試」。
        </div>
        <div className="col-span-1 text-lg capitalize rounded-md flex flex-row-reverse justify-center">
          <div className="flex space-x-4">
            {isRecording && (
              <div className="mt-1.5 animate-pulse bg-red-600 w-4 h-4 rounded-full"></div>
            )}
            <div>錄製時間: {recordingTime} 秒</div>
          </div>
        </div>
        <div className="col-span-1 text-lg rounded-md flex flex-row-reverse justify-center">
          <Button
            text={isRecording ? "停止錄音" : "開始錄音"}
            onClick={handleRecordClick}
          ></Button>
        </div>
        <div className="mb-10 col-span-1 text-lg rounded-md flex flex-row-reverse justify-center">
          <div className="flex space-x-4">
            <Button
              text="試聽"
              disabled={audioBlob === null}
              onClick={handlePlayClick}
            ></Button>
            <Button
              text="上傳"
              disabled={audioBlob === null}
              onClick={handleUploadClick}
            ></Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioRecorder;
