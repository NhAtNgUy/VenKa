import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import styled from "styled-components";

const CategoryDetailPage = ({ setSelectedVideo }) => {
  const { category_name } = useParams(); // Lấy thể loại từ URL
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/category/${category_name}`);
        setVideos(response.data.results);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchVideos();
  }, [category_name]);

  return (
    <StyledWrapper>
      <div style={{ width: "100%", padding: "10px"}}>
        <h2>{category_name}</h2>
        <div className="video-container">
          {videos.map((video) => (
            <div
              key={video.videoId}
              style={{ margin: "10px", cursor: "pointer", background : "#f0f0f0"}}
              onClick={() => setSelectedVideo(video.videoId)}
            >
              <img src={video.thumbnail} alt={video.title} />
              <h4>{video.title}</h4>
              <p>Views: {video.viewCount}</p>
            </div>
          ))}
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
.video-container {
    max-height: 577px; /* Đặt chiều cao tối đa */
    overflow-y: auto; /* Hiển thị thanh cuộn dọc nếu nội dung vượt quá */
    padding: 10px;
    border-radius: 10px;
    background: #f9f9f9;
  }
`

export default CategoryDetailPage;