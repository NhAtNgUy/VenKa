import React, { useState, useEffect } from "react";
import { db, auth } from "../firebaseConfig";
import { collection, addDoc, query, where, orderBy, onSnapshot, limit, Timestamp } from "firebase/firestore";

const CommentSection = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Kiểm tra videoId kỹ hơn
    console.log("Current videoId in CommentSection (type and value):", typeof videoId, videoId);
    if (!videoId || videoId === "" || videoId === null || videoId === undefined) {
      setComments([]);
      console.log("No valid videoId, resetting comments");
      return;
    }

    // Chuẩn hóa videoId thành chuỗi và loại bỏ khoảng trắng
    const normalizedVideoId = videoId.toString().trim();
    console.log("Normalized videoId:", normalizedVideoId);

    setLoading(true);
    const q = query(
      collection(db, "comments"),
      where("videoId", "==", normalizedVideoId), // Sử dụng videoId đã chuẩn hóa
      orderBy("timestamp", "desc"),
      limit(10)
    );

    console.log("Query created for videoId:", normalizedVideoId);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log("Snapshot received, docs count:", snapshot.docs.length);
      const fetchedComments = snapshot.docs.map(doc => {
        const data = doc.data();
        let timestamp = data.timestamp;
        console.log("Processing document:", doc.id, data); // Log từng tài liệu
        if (timestamp instanceof Timestamp) {
          timestamp = timestamp.toDate();
        } else if (typeof timestamp === 'object' && timestamp.seconds) {
          timestamp = new Date(timestamp.seconds * 1000);
        } else {
          console.warn("Unexpected timestamp format for doc:", doc.id, timestamp);
          timestamp = new Date(); // Fallback
        }
        return { id: doc.id, ...data, timestamp };
      });
      console.log("Fetched comments for videoId", normalizedVideoId, ":", fetchedComments);
      setComments(fetchedComments);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching comments:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [videoId]);

  const handleCommentSubmit = async () => {
    if (!auth.currentUser) {
      alert("Bạn phải đăng nhập để bình luận!");
      return;
    }

    if (newComment.trim() === "") return;

    try {
      const normalizedVideoId = videoId.toString().trim(); // Chuẩn hóa videoId
      const commentData = {
        videoId: normalizedVideoId,
        text: newComment,
        user: auth.currentUser.email,
        timestamp: Timestamp.now(),
      };
      console.log("Sending comment:", commentData);
      const docRef = await addDoc(collection(db, "comments"), commentData);
      console.log("Comment added with ID:", docRef.id);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Có lỗi xảy ra khi gửi bình luận!");
    }
  };

  return (
    <div style={{ marginTop: "20px", padding: "10px", borderTop: "1px solid #ccc", color: "#fff" }}>
      <h3 style={{ color: "#fff" }}>Bình luận</h3>

      {auth.currentUser ? (
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Viết bình luận..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleCommentSubmit()}
            style={{ width: "70%", padding: "8px", marginRight: "10px", borderRadius: "4px", border: "none" }}
          />
          <button
            onClick={handleCommentSubmit}
            style={{
              padding: "8px 16px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Gửi
          </button>
        </div>
      ) : (
        <p>Vui lòng đăng nhập để bình luận.</p>
      )}

      {loading ? (
        <p>Đang tải bình luận...</p>
      ) : comments.length > 0 ? (
        <ul style={{ listStyleType: "none", padding: "0", maxHeight: "300px", overflowY: "auto" }}>
          {comments.map((comment) => (
            <li key={comment.id} style={{ marginBottom: "10px", padding: "10px", borderBottom: "1px solid #eee" }}>
              <strong>{comment.user}</strong>: {comment.text}
              <br />
              <small>{comment.timestamp ? new Date(comment.timestamp).toLocaleString("vi-VN") : "Không có thời gian"}</small>
              <div>Video ID: {comment.videoId} (Current videoId: {videoId.toString().trim()})</div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Chưa có bình luận nào cho video này (videoId: {videoId ? videoId.toString().trim() : "None"}).</p>
      )}
    </div>
  );
};

export default CommentSection;