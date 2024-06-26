import React, { useState, useEffect, useRef } from "react";
import Slider from "@mui/material/Slider";
import "./audioPlayer.css";

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
  const [isVolumeSliderVisible, setIsVolumeSliderVisible] = useState(false);
  const [volume, setVolume] = useState(100);
  const [isDragging, setIsDragging] = useState(false);

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

  const toggleVolumeSlider = () => {
    setIsVolumeSliderVisible(!isVolumeSliderVisible);
  };

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    const volumeValue = newValue as number;
    if (!isNaN(volumeValue)) {
      setVolume(volumeValue);
      if (audioRef.current) {
        audioRef.current.volume = volumeValue / 100;
      }
    }
  };

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setPlayProgress(newValue as number);
  };

  const handleSliderChangeCommitted = (
    event: React.SyntheticEvent | Event,
    newValue: number | number[]
  ) => {
    if (audioRef.current) {
      const newTime = (newValue as number * audioRef.current.duration) / 100;
      audioRef.current.currentTime = newTime;
      setCurrentTime(formatTime(newTime));
      setIsDragging(false);
    }
  };

  const animationFrameId = useRef<number | null>(null);
  const lastUpdateTime = useRef<number>(0);
  const updateInterval = 100; // 更新頻率限制為 10 fps

  const updateProgress = () => {
    if (audioRef.current && !isDragging)  {
      const current = audioRef.current.currentTime;
      const now = performance.now();

      // 如果距離上次更新的時間小於更新間隔，則不進行更新
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
            onChange={handleSliderChange}
            onChangeCommitted={handleSliderChangeCommitted}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
          />
        </div>
        <div className="volume-control">
          <button onClick={toggleVolumeSlider} className="volume-btn">
            <svg
              viewBox="0 0 24 24"
              height="32"
              width="32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3 9v6h4l5 5V4L7 9H3z" fill="#566574" />
              <path
                d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.06c1.48-.74 2.5-2.26 2.5-4.03z"
                fill="#566574"
              />
              <path
                d="M19 12c0 2.5-1.28 4.68-3.22 5.91l1.42 1.42C19.32 18.26 21 15.26 21 12s-1.68-6.26-4.29-7.33l-1.42 1.42C18.72 7.32 19 9.57 19 12z"
                fill="#566574"
              />
            </svg>
          </button>
          {isVolumeSliderVisible && (
            <div className="volume-slider-container h-24 w-8 bg-white shadow-md rounded-xl p-4">
              <Slider
                size="small"
                orientation="vertical"
                value={volume}
                onChange={handleVolumeChange}
                aria-label="Volume"
                valueLabelDisplay="on"
                max={100}
              />
            </div>
          )}
        </div>
        <div>
          {currentAudioFile !== "" && (
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
