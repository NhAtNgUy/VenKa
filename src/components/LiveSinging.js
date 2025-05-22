import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import * as Tone from "tone";

const LiveSinging = () => {
  const [isSinging, setIsSinging] = useState(false);
  const [pitchShiftValue, setPitchShiftValue] = useState(0);
  const [reverbValue, setReverbValue] = useState(0.5);
  const [sourceNode, setSourceNode] = useState(null);
  const pitchShiftRef = useRef(null);
  const reverbRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState(""); // Thêm state để lưu thông báo lỗi

  // Bắt đầu ghi âm và áp dụng hiệu ứng
  const startSinging = async () => {
    try {
      // Đảm bảo Tone.js được khởi động
      await Tone.start();
      console.log("Tone.js started");

      // Kiểm tra quyền truy cập micro
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Micro access granted:", stream);

      // Mở luồng âm thanh từ Tone.js
      const input = new Tone.UserMedia();
      await input.open();
      console.log("Tone.UserMedia opened");

      // Tạo các node hiệu ứng
      const newPitchShift = new Tone.PitchShift(pitchShiftValue).toDestination();
      const newReverb = new Tone.Reverb(reverbValue).toDestination();

      // Kết nối luồng âm thanh: micro -> pitch shift -> reverb -> output
      input.connect(newPitchShift);
      newPitchShift.connect(newReverb);

      setSourceNode(input);
      pitchShiftRef.current = newPitchShift;
      reverbRef.current = newReverb;
      setIsSinging(true);
      setErrorMessage(""); // Xóa thông báo lỗi nếu thành công
    } catch (error) {
      console.error("Error starting singing:", error);
      let message = "Không thể truy cập micro. Vui lòng kiểm tra quyền truy cập.";
      if (error.name === "NotAllowedError") {
        message = "Quyền truy cập micro bị từ chối. Vui lòng cấp quyền trong cài đặt trình duyệt.";
      } else if (error.name === "NotFoundError") {
        message = "Không tìm thấy micro. Vui lòng kiểm tra thiết bị của bạn.";
      } else if (error.name === "NotReadableError") {
        message = "Micro đang được sử dụng bởi ứng dụng khác. Vui lòng kiểm tra.";
      }
      setErrorMessage(message);
    }
  };

  // Dừng ghi âm
  const stopSinging = () => {
    if (sourceNode) {
      sourceNode.close();
      setSourceNode(null);
    }
    if (pitchShiftRef.current) {
      pitchShiftRef.current.dispose();
      pitchShiftRef.current = null;
    }
    if (reverbRef.current) {
      reverbRef.current.dispose();
      reverbRef.current = null;
    }
    setIsSinging(false);
    setErrorMessage("");
  };

  // Cập nhật pitch khi người dùng thay đổi
  useEffect(() => {
    if (pitchShiftRef.current) {
      pitchShiftRef.current.pitch = pitchShiftValue;
    }
  }, [pitchShiftValue]);

  // Cập nhật reverb khi người dùng thay đổi
  useEffect(() => {
    if (reverbRef.current) {
      reverbRef.current.decay = reverbValue;
    }
  }, [reverbValue]);

  return (
    <StyledLiveSinging>
      <h3 style={{ color: "#fff", marginBottom: "20px" }}>Hát trực tiếp</h3>
      <button
        onClick={isSinging ? stopSinging : startSinging}
        style={{
          padding: "5px 10px",
          backgroundColor: isSinging ? "#ff4444" : "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          marginBottom: "20px",
        }}
      >
        {isSinging ? "Dừng hát" : "Bắt đầu hát"}
      </button>

      {errorMessage && (
        <p style={{ color: "#ff4444", marginBottom: "15px" }}>{errorMessage}</p>
      )}

      <div style={{ marginBottom: "15px" }}>
        <label style={{ color: "#fff", marginRight: "10px" }}>Thay đổi pitch: </label>
        <input
          type="range"
          min="-12"
          max="12"
          value={pitchShiftValue}
          onChange={(e) => setPitchShiftValue(Number(e.target.value))}
          disabled={!isSinging}
        />
        <span style={{ color: "#fff", marginLeft: "10px" }}>{pitchShiftValue}</span>
      </div>

      <div>
        <label style={{ color: "#fff", marginRight: "10px" }}>Reverb: </label>
        <input
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={reverbValue}
          onChange={(e) => setReverbValue(Number(e.target.value))}
          disabled={!isSinging}
        />
        <span style={{ color: "#fff", marginLeft: "10px" }}>{reverbValue}</span>
      </div>
    </StyledLiveSinging>
  );
};

const StyledLiveSinging = styled.div`
  padding: 20px;
  background: #07182e;
  border-radius: 5px;
  color: #fff;
  text-align: center;
`;

export default LiveSinging;