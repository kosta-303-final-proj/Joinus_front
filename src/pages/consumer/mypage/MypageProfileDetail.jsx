import React from "react";
import { useNavigate } from "react-router-dom";
import "./MypageProfileDetail.css";

export default function MypageProfileDetail() {
  const navigate = useNavigate();

  return (
    <>
      {/* 상단 타이틀 */}
      <div className="profiledetail-title-row">
        <div className="profiledetail-page-title">개인정보 관리</div>
      </div>

      {/* 정보 박스 */}
      <div className="profiledetail-info-box">

        <div className="profiledetail-form-group">
          <label>아이디</label>
          <input type="text" value="ehgns0311" readOnly />
        </div>

        <div className="profiledetail-form-group">
          <label>비밀번호</label>
          <input type="password" value="************" readOnly />
        </div>

        <div className="profiledetail-form-group">
          <label>닉네임</label>
          <input type="text" value="박도훈" readOnly />
        </div>

        <div className="profiledetail-form-group">
          <label>연락처</label>
          <input type="text" value="010-5241-8372" readOnly />
        </div>

        <div className="profiledetail-form-group">
          <label>이메일</label>
          <input type="text" value="ehgns0311@example.com" readOnly />
        </div>

        <div className="profiledetail-form-group">
          <label>주소</label>
          <input type="text" value="서울특별시 강남구 테헤란로 212, 3층" readOnly />
        </div>

        <div className="profiledetail-form-group">
          <label>생년월일</label>
          <input type="text" value="1998-06-12" readOnly />
        </div>

        <div className="profiledetail-form-group">
          <label>성별</label>
          <input type="text" value="남성" readOnly />
        </div>

        <div className="profiledetail-form-group">
          <label>추천인 ID</label>
          <input type="text" value="dekdjf0312" readOnly />
        </div>

        {/* 버튼 모음 */}
        <div className="profiledetail-btn-wrap">

          <button
            className="profiledetail-btn-edit"
            onClick={() => navigate("/mypage/profileEdit")}
          >
            수정
          </button>

          <button
            className="profiledetail-btn-quit"
            onClick={() => navigate("/mypage/deleteAccount")}
          >
            회원탈퇴
          </button>

        </div>

      </div>
    </>
  );
}
