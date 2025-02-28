// components/CommentSection.js
import React, { useState, useEffect } from "react";
import { db, auth } from "../firebaseConfig";
import { collection, addDoc, query, where, orderBy, onSnapshot } from "firebase/firestore";

const CommentSection = ({ videoId }) => {
  const [comments, setComments] = useState([]); // Danh sách bình luận
  const [newComment, setNewComment] = useState(""); // Nội dung bình luận mới

  // 🔹 Load comments khi videoId thay đổi
  useEffect(() => {
    if (!videoId) return; // Nếu không có videoId, không làm gì cả

    // Tạo query để lấy bình luận của video hiện tại
    const q = query(
      collection(db, "comments"),
      where("videoId", "==", videoId),
      orderBy("timestamp", "desc") // Sắp xếp theo thời gian giảm dần
    );

    // Lắng nghe thay đổi từ Firestore
    const unsubscribe = onSnapshot(q, (snapshot) => {
        console.log("Fetched comments:", snapshot.docs);
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Dọn dẹp listener khi component unmount
    return () => unsubscribe();
  }, [videoId]);

  // 🔹 Xử lý gửi bình luận
  const handleCommentSubmit = async () => {
    if (!auth.currentUser) {
      alert("Bạn phải đăng nhập để bình luận!");
      return;
    }

    if (newComment.trim() === "") return; // Không gửi bình luận trống

    // Thêm bình luận vào Firestore
    await addDoc(collection(db, "comments"), {
      videoId,
      text: newComment,
      user: auth.currentUser.email,
      timestamp: new Date()
    });

    setNewComment(""); // Xóa nội dung input sau khi gửi
  };

  return (
    <div style={{ marginTop: "20px", padding: "10px", borderTop: "1px solid #ccc" }}>
      <h3>Bình luận</h3>
      <div>
        {auth.currentUser ? (
          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="Viết bình luận..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              style={{ width: "80%", padding: "8px", marginRight: "10px" }}
            />
            <button 
              onClick={handleCommentSubmit}
              style={{ padding: "8px 16px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "4px" }}
            >
              Gửi
            </button>
          </div>
        ) : (
          <p>Vui lòng đăng nhập để bình luận.</p>
        )}
      </div>
  
      {/* Hiển thị danh sách bình luận */}
      <ul style={{ listStyleType: "none", padding: "0" }}>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <li key={comment.id} style={{ marginBottom: "10px", padding: "10px", borderBottom: "1px solid #eee" }}>
              <strong>{comment.user}</strong>: {comment.text}
              <br />
              <small>{new Date(comment.timestamp?.seconds * 1000).toLocaleString()}</small>
            </li>
          ))
        ) : (
          <p>Chưa có bình luận nào.</p>
        )}
      </ul>
    </div>
  );
};

export default CommentSection;