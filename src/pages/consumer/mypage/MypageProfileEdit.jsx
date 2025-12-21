import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MypageProfileEdit.css";
import axios from "axios";

export default function MypageProfileEdit() {
  const navigate = useNavigate();

  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  const username = userInfo?.username;

  const [form, setForm] = useState({
    username: "",
    password: "",          // ✅ 비밀번호 수정
    name: "",
    nickname: "",
    phone: "",
    email: "",
    birthDate: "",
    gender: "",
    recommenderUsername: ""
  });

  // ===============================
  // 기존 프로필 불러오기
  // ===============================
  useEffect(() => {
    if (!username) return;

    axios
      .get(`http://localhost:8080/mypage/profile?username=${username}`)
      .then((res) => {
        const d = res.data;
        setForm({
          username: d.username,
          password: "", // 🔥 수정 시에만 입력
          name: d.name,
          nickname: d.nickname,
          phone: d.phone,
          email: d.email,
          birthDate: d.birthDate,
          gender: d.gender,
          recommenderUsername: d.recommenderUsername,
        });
      })
      .catch((err) => console.error(err));
  }, [username]);

  // ===============================
  // input 공용 핸들러
  // ===============================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ===============================
  // 저장
  // ===============================
const handleSave = () => {
  const payload = { ...form };

  // 비밀번호 미입력 시 제외
  if (!payload.password) {
    delete payload.password;
  }

  axios
    .put("http://localhost:8080/mypage/profile/update", payload)
    .then(() => {
      alert("개인정보가 수정되었습니다.");
      navigate("/mypage/profileDetail");
    })
    .catch((err) => {
      console.error(err);
      alert("수정 중 오류가 발생했습니다.");
    });
};


  return (
    <>
      <div className="profileedit-title-row">
        <div className="profileedit-page-title">개인정보 수정</div>
      </div>

      <div className="profileedit-info-box">

        {/* 아이디 (수정 불가) */}
        <div className="profileedit-form-group">
          <label>아이디</label>
          <input type="text" value={form.username} readOnly />
        </div>

        {/* 비밀번호 (수정 가능) */}
        <div className="profileedit-form-group">
          <label>비밀번호</label>
          <input
            type="password"
            name="password"
            placeholder="********"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        {/* 이름 */}
        <div className="profileedit-form-group">
          <label>이름</label>
          <input name="name" value={form.name} onChange={handleChange} />
        </div>

        {/* 닉네임 */}
        <div className="profileedit-form-group">
          <label>닉네임</label>
          <input name="nickname" value={form.nickname} onChange={handleChange} />
        </div>

        {/* 연락처 */}
        <div className="profileedit-form-group">
          <label>연락처</label>
          <input name="phone" value={form.phone} onChange={handleChange} />
        </div>

        {/* 이메일 */}
        <div className="profileedit-form-group">
          <label>이메일</label>
          <input name="email" value={form.email} onChange={handleChange} />
        </div>

        {/* 생년월일 */}
        <div className="profileedit-form-group">
          <label>생년월일</label>
          <input
            type="date"
            name="birthDate"
            value={form.birthDate}
            onChange={handleChange}
          />
        </div>

        {/* 성별 */}
        <div className="profileedit-form-group">
          <label>성별</label>
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="">선택</option>
            <option value="M">남성</option>
            <option value="F">여성</option>
          </select>
        </div>

        {/* 추천인 (수정 불가) */}
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
