import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SearchPage from "./Pages/SearchPage";
import FavoritesPage from "./Pages/FavoritesPage";
import CategoriesPage from "./Pages/CategoriesPage";
import CategoryDetailPage from "./Pages/CategoryDetailPage";
import { Helmet } from 'react-helmet';
import Player from "./components/Player";
import Button from "./components/Button";
import styled from "styled-components";
import AuthPage from "./Pages/AuthPage";
import CommentSection from "./components/CommentSection";

const App = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  return (
    <Router>
      <Helmet> 
        <title>VenKa - Website Karaoke Tổng Hợp</title>

        <meta name="google-site-verification" content="keZwuT35I645YU8sx38bT--gghE92NagRbxiRW2_gEQ" />     
        <meta 
          name = "description" 
          content="Venka là website giúp bạn tìm kiếm và giao lưu karaoke với người thân và bạn bè. 
          Khám phá các thể loại đã được phân loại, gợi ý bài hát khác dựa trên sở thích của bản thân."
        /> 

        <meta
          name='keywords' 
          content='karaoke, VenKa, nhạc'
        />
        
      </Helmet>

      <StyledWrapper>
        <div style={{ display: "flex" }}>
          {/* Menu bên trái */}
            <div className="BackMenu" style={{minHeight: "100vh" }}>
              <Button /> {/* Sử dụng menu mới */}
            </div>
          {/* Nội dung chính */}
          <div style={{ width: "60%", padding: "10px" }}>
            <Routes>
              <Route path="/" element={<SearchPage setSelectedVideo={setSelectedVideo} />} />
              <Route path="/favorites" element={<FavoritesPage setSelectedVideo={setSelectedVideo} />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/categories/:category_name" element={<CategoryDetailPage setSelectedVideo={setSelectedVideo} />} />
              <Route path="/account" element={<AuthPage />} />
            </Routes>
          </div>

          {/* Player */}
          <div style={{ display: "flex", flexDirection: "column", background: "#07182E", padding: "10px"}}>
            <Player videoId={selectedVideo} /> 
            <CommentSection videoId={selectedVideo}/>
          </div>
        </div>
      </StyledWrapper>
    </Router>
  );
};

const StyledWrapper = styled.div`
  .BackMenu{
    background: #07182E;
    width: "15%"; 
    padding: "10px";
  }
`;

export default App;
