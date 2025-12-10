import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MypageProfileEdit.css";

export default function MypageProfileEdit() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "ehgns0311",
    password: "",
    name: "박도훈",
    nickname: "도훈이",
    phone: "010-5241-8372",
    email: "ehgns0311@example.com",
    birth: "1998-06-12",
    gender: "M",
    recommenderUsername: "dekdjf0312",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    alert("개인정보가 수정되었습니다!");
    navigate("/mypage/profileDetail");
  };

  return (
    <>
      <div className="profileedit-title-row">
        <div className="profileedit-page-title">개인정보 수정</div>
      </div>

      <div className="profileedit-info-box">

        {/* 아이디 */}
        <div className="profileedit-form-group">
          <label>아이디</label>
          <input type="text" value={form.username} readOnly />
        </div>


        {/* 비밀번호 */}
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

        {/* 이름 */}
        <div className="profileedit-form-group">
          <label>이름</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        {/* 닉네임 */}
        <div className="profileedit-form-group">
          <label>닉네임</label>
          <input
            type="text"
            name="nickname"
            value={form.nickname}
            onChange={handleChange}
          />
        </div>

        {/* 연락처 */}
        <div className="profileedit-form-group">
          <label>연락처</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        {/* 이메일 */}
        <div className="profileedit-form-group">
          <label>이메일</label>
          <input
            type="text"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        {/* 생년월일 */}
        <div className="profileedit-form-group">
          <label>생년월일</label>
          <input
            type="date"
            name="birth"
            value={form.birth}
            onChange={handleChange}
          />
        </div>

        {/* 성별 */}
        <div className="profileedit-form-group">
          <label>성별</label>
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="M">남성</option>
            <option value="F">여성</option>
          </select>
        </div>

        {/* 추천인 ID */}
        <div className="profileedit-form-group">
          <label>추천인 ID</label>
          <input type="text" value={form.recommenderUsername} readOnly />
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
