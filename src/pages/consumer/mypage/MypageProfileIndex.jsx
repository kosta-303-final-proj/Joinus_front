import React, { useState } from "react";
import "./MypageProfileIndex.css";
import { useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import axios from "axios";

export default function MypageProfileIndex() {

  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  // 로그인한 유저 정보 가져오기
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const username = userInfo?.username;

  const handleCheck = () => {

    if (!password.trim()) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    axios.post("http://localhost:8080/mypage/validate-password", {
      username: username, 
      password: password
    })
    .then(res => {
      if (res.data.valid) {
        navigate("/mypage/profileDetail");
      } else {
        alert("비밀번호가 일치하지 않습니다.");
      }
    })
    .catch(err => {
      console.error(err);
      alert("오류가 발생했습니다.");
    });
  };


  return (
    <>
      <div className="profileindex-title">개인정보 관리</div>

      <div className="profileindex-verify-box">

        <div className="profileindex-verify-icon">
          <FaLock size={40} color="#739FF2" />
        </div>

        <div className="profileindex-verify-title">
          개인정보를 수정하시려면 비밀번호를 입력해주세요.
        </div>

        <div className="profileindex-verify-subtext">
          회원님의 개인정보 보호를 위해 비밀번호 확인 절차가 필요합니다.
        </div>

        <div className="profileindex-input-box">
          <input 
            type="password" 
            placeholder="비밀번호를 입력해주세요."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
             onKeyDown={(e) => e.key === "Enter" && handleCheck()}
          />
        </div>

        <div className="profileindex-btn-row">
          <button
            className="profileindex-btn profileindex-btn-blue"
            onClick={handleCheck}
          >
            확인
          </button>

          <button className="profileindex-btn profileindex-btn-cancel"
          onClick={() => navigate("/mypage/main")} 
          >
            취소
          </button>
        </div>

      </div>
    </>
  );
}
