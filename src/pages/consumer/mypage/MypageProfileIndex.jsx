import React from "react";
import "./MypageProfileIndex.css";
import { useNavigate } from "react-router-dom";

export default function MypageProfileIndex() {

  const navigate = useNavigate();

  return (
    <>
      <div className="profileindex-title">개인정보 관리</div>
      <div className="profileindex-desc">
        회원님의 소중한 정보를 안전하게 관리하세요.
      </div>

      <div className="profileindex-verify-box">

        <img
          className="profileindex-verify-icon"
          src="https://i.ibb.co/CK0XkTnJ/verify.png"
          alt="verify"
        />

        <div className="profileindex-verify-title">
          개인정보를 수정하시려면 비밀번호를 입력해주세요.
        </div>

        <div className="profileindex-verify-subtext">
          회원님의 개인정보 보호를 위해 비밀번호 확인 절차가 필요합니다.
        </div>

        <div className="profileindex-input-box">
          <input type="password" placeholder="비밀번호를 입력해주세요." />
        </div>

        <div className="profileindex-btn-row">
          <button
            className="profileindex-btn profileindex-btn-blue"
            onClick={() => navigate("/mypage/profileDetail")}
          >
            확인
          </button>

          <button className="profileindex-btn profileindex-btn-cancel">
            취소
          </button>
        </div>

      </div>
    </>
  );
}
