import React, { useState, useEffect } from "react";
import { auth } from "../firebaseConfig";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null); // Lưu trạng thái đăng nhập

  // Theo dõi trạng thái đăng nhập
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleAuth = async () => {
    setError("");
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Đăng nhập thành công!");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Tạo tài khoản thành công!");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      alert("Đăng xuất thành công!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {user ? (
        // Hiển thị khi đã đăng nhập
        <div>
          <h2>Xin chào, {user.email}!</h2>
          <button onClick={handleSignOut}>Đăng xuất</button>
        </div>
      ) : (
        // Hiển thị form đăng nhập / đăng ký
        <div>
          <h2>{isLogin ? "Đăng nhập" : "Đăng ký"}</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <input 
            type="email" 
            placeholder="Email" 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Mật khẩu" 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button onClick={handleAuth}>{isLogin ? "Đăng nhập" : "Đăng ký"}</button>
          <p 
            onClick={() => setIsLogin(!isLogin)} 
            style={{ cursor: "pointer", color: "blue" }}
          >
            {isLogin ? "Chưa có tài khoản? Đăng ký ngay" : "Đã có tài khoản? Đăng nhập"}
          </p>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
