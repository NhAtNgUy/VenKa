import React from "react";
import { Link } from "react-router-dom";

const CategoriesPage = () => {
  // Danh sách các thể loại
  const categories = [
    { name: "Karaoke nhạc trẻ", path: "Karaoke nhạc trẻ" },
    { name: "Karaoke nhạc trending", path: "Karaoke nhạc trending" },
    { name: "Karaoke nhạc bolero", path: "Karaoke nhạc bolero" },
  ];

  return (
    <div style={{ width: "100%", padding: "10px" }}>
      <h2>Phân loại</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {categories.map((category) => (
          <li key={category.path} style={{ margin: "10px 0" }}>
            <Link
              to={`/categories/${category.path}`}
              style={{ textDecoration: "none", color: "blue", fontSize: "18px" }}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesPage;