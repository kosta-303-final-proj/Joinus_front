import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MypageProfileEdit.css";

export default function MypageProfileEdit() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    userId: "ehgns0311",
    password: "",
    nickname: "박도훈",
    phone: "010-5241-8372",
    email: "ehgns0311@example.com",
    address: "서울특별시 강남구 테헤란로 212, 3층",
    birth: "1998-06-12",
    gender: "남성",
    recommender: "dekdjf0312"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    alert("개인정보가 수정되었습니다!");
    navigate("/mypage/profileDetail");
  };

  return (
    <>

      {/* 타이틀 */}
      <div className="profileedit-title-row">
        <div className="profileedit-page-title">개인정보 수정</div>
      </div>

      <div className="profileedit-info-box">

        <div className="profileedit-form-group">
          <label>아이디</label>
          <input type="text" value={form.userId} readOnly />
        </div>

        <div className="profileedit-form-group">
          <label>비밀번호 변경</label>
          <input
            type="password"
            name="password"
            placeholder="새 비밀번호 입력"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <div className="profileedit-form-group">
          <label>닉네임</label>
          <input
            type="text"
            name="nickname"
            value={form.nickname}
            onChange={handleChange}
          />
        </div>

        <div className="profileedit-form-group">
          <label>연락처</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        <div className="profileedit-form-group">
          <label>이메일</label>
          <input
            type="text"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="profileedit-form-group">
          <label>주소</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
          />
        </div>

        <div className="profileedit-form-group">
          <label>생년월일</label>
          <input
            type="text"
            name="birth"
            value={form.birth}
            onChange={handleChange}
          />
        </div>

        <div className="profileedit-form-group">
          <label>성별</label>
          <input
            type="text"
            name="gender"
            value={form.gender}
            onChange={handleChange}
          />
        </div>

        <div className="profileedit-form-group">
          <label>추천인 ID</label>
          <input type="text" value={form.recommender} readOnly />
        </div>

        <div className="profileedit-btn-wrap">
          <button className="profileedit-btn-save" onClick={handleSave}>
            수정 완료
          </button>
        </div>

      </div>
    </>
  );
}
