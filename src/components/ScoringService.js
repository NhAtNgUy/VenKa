import axios from "axios";

export const runScoring = async (video, setScores, setLoading, setError) => {
  setLoading(true);
  try {
    const formData = new FormData();
    formData.append("video_id", video.videoId);
    formData.append("user_audio_path", "test_audio/song15.mp3");

    const response = await axios.post("http://localhost:8000/process-and-score", formData);
    setScores(response.data);
    console.log("Scoring results:", response.data);
  } catch (error) {
    console.error("Error processing and scoring:", error);
    setError("Có lỗi xảy ra khi xử lý và chấm điểm.");
  } finally {
    setLoading(false);
  }
};