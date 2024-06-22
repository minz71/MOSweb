import React, { useState, useEffect, useRef } from "react";
import Slider from "@mui/material/Slider";
import "./audioPlayer.css"
interface AudioProps {
  audioFile: string;
  playPauseOnClick?: () => void;
  tourRef?: React.RefObject<any>;
}

const AudioComponent: React.FC<AudioProps> = ({
  audioFile,
  playPauseOnClick,
  tourRef,
}) => {
  const [currentAudioFile, setCurrentAudioFile] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playProgress, setPlayProgress] = useState(0);

  const togglePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.play();
        updateProgress();
      }
    }
    if (playPauseOnClick) {
      playPauseOnClick();
    }
  };

  const animationFrameId = useRef<number | null>(null);
  const lastUpdateTime = useRef<number>(0);
  const updateInterval = 100; // 更新頻率限制為 10 fps

  const updateProgress = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const now = performance.now();

      // 如果距離上次更新的時間小於更新間隔,則不進行更新
      if (now - lastUpdateTime.current < updateInterval) {
        animationFrameId.current = requestAnimationFrame(updateProgress);
        return;
      }

      lastUpdateTime.current = now;
      setCurrentTime(formatTime(current));
      const progress = (current / audioRef.current.duration) * 100;
      setPlayProgress(progress);
      animationFrameId.current = requestAnimationFrame(updateProgress);
    }
  };
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };
  useEffect(() => {
    const myAudioElement = audioRef.current;
    return () => {
      if (myAudioElement) {
        cancelAnimationFrame(animationFrameId.current!);
      }
    };
  }, [audioFile]);
  useEffect(() => {
    setIsPlaying(false);
    setCurrentAudioFile(audioFile);
    setPlayProgress(0);
  }, [audioFile]);

  return (
    <div className="col-span-1 rounded-md">
      <div className="audio green-audio-player">
        <div className="play-pause-btn" onClick={togglePlayPause} ref={tourRef}>
          <svg
            viewBox="0 0 18 24"
            height="24"
            width="18"
            xmlns="<http://www.w3.org/2000/svg>"
          >
            <path
              id="playPause"
              className="play-pause-icon"
              d={isPlaying ? "M0 0h6v24H0zM12 0h6v24h-6z" : "M18 12L0 24V0z"}
              fill="#566574"
            />
          </svg>
        </div>
        <div className="controls gap-4">
          <span className="current-time">{currentTime}</span>
          <Slider
            defaultValue={0}
            value={playProgress}
            aria-label="Default"
            valueLabelDisplay="off"
          />
        </div>
        <div>
          {currentAudioFile != "" && (
            <audio key={currentAudioFile} ref={audioRef}>
              <source src={currentAudioFile} type="audio/x-wav" />
            </audio>
          )}
        </div>
      </div>
    </div>
  );
};
export default AudioComponent;
