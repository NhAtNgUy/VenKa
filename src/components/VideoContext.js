import React, { createContext, useContext, useState } from "react";
import { runScoring } from "./ScoringService";

const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [scores, setScores] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const scoreVideo = (video) => {
    if (video && video.videoId) {
      runScoring(video, setScores, setLoading, setError);
    }
  };

  return (
    <VideoContext.Provider
      value={{ currentVideo, setCurrentVideo, scores, setScores, loading, setLoading, error, setError, scoreVideo }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error("useVideo must be used within a VideoProvider");
  }
  return context;
};