import React from "react";

const FavoritesPage = ({ setSelectedVideo }) => {
  // Giả sử danh sách yêu thích được lưu trong state hoặc API
  const favorites = [
    { videoId: "dQw4w9WgXcQ", title: "Favorite Song 1", thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg" },
    { videoId: "EJ9x4qZ4w4A", title: "Favorite Song 2", thumbnail: "https://i.ytimg.com/vi/EJ9x4qZ4w4A/default.jpg" },
  ];

  return (
    <div style={{ width: "100%" }}>
      <h2>Yêu thích</h2>
      <div>
        {favorites.map((favorite) => (
          <div
            key={favorite.videoId}
            style={{ margin: "10px", cursor: "pointer" }}
            onClick={() => setSelectedVideo(favorite.videoId)}
          >
            <img src={favorite.thumbnail} alt={favorite.title} />
            <h4>{favorite.title}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;