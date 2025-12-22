import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MypageProfileEdit.css";
import axios from "axios";

export default function MypageProfileEdit() {
  const navigate = useNavigate();

  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  const username = userInfo?.username;
  const loginType = userInfo?.login_type;
  const isKakao = loginType === "KAKAO" || (username && username.startsWith("kakao_"));

  const [form, setForm] = useState({
    username: "",
    password: "",
    name: "",
    nickname: "",
    phone: "",
    email: "",
    birthDate: "",
    gender: "",
    recommenderUsername: ""
  });

  useEffect(() => {
    if (!username) return;
    axios
      .get(`http://localhost:8080/mypage/profile?username=${username}`)
      .then((res) => {
        const d = res.data;
        setForm({
          username: d.username || "",
          password: "",
          name: d.name || "",
          nickname: d.nickname || "",
          phone: d.phone || "",
          email: d.email || "",
          birthDate: d.birthDate || "",
          gender: d.gender || "",
          recommenderUsername: d.recommenderUsername || ""
        });
      })
      .catch((err) => console.error(err));
  }, [username]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

 const handleSave = () => {
  const payload = { ...form };
  
  // 카카오 유저거나 비밀번호 입력이 없으면 페이로드에서 제외
  if (isKakao || !payload.password?.trim()) {
    delete payload.password;
  }

  axios
    .put("http://localhost:8080/mypage/profile/update", payload)
    .then(() => {
      // 수정 성공 시, 브라우저 세션 스토리지의 userInfo도 함께 업데이트합니다.
        const updatedUserInfo = {
        ...userInfo,          // 기존의 토큰 정보 등은 유지
        name: form.name,      // 수정된 이름 반영
        nickname: form.nickname // 수정된 닉네임 반영
      };
      
      // 세션 스토리지에 덮어쓰기
      sessionStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));

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
        {/* 아이디 - 모든 유저 수정 불가 */}
        <div className="profileedit-form-group">
          <label>아이디</label>
          <input type="text" value={form.username} readOnly />
        </div>

        {/* 비밀번호 - 카카오 유저가 아닐 때만 노출 */}
        {!isKakao && (
          <div className="profileedit-form-group">
            <label>비밀번호</label>
            <input
              type="password"
              name="password"
              placeholder="변경할 비밀번호를 입력하세요 (미입력 시 유지)"
              value={form.password}
              onChange={handleChange}
            />
          </div>
        )}

        <div className="profileedit-form-group">
          <label>이름</label>
          <input name="name" value={form.name} onChange={handleChange} />
        </div>

        <div className="profileedit-form-group">
          <label>닉네임</label>
          <input name="nickname" value={form.nickname} onChange={handleChange} />
        </div>

        <div className="profileedit-form-group">
          <label>연락처</label>
          <input name="phone" value={form.phone} onChange={handleChange} />
        </div>

        <div className="profileedit-form-group">
          <label>이메일</label>
          <input name="email" value={form.email} onChange={handleChange} />
        </div>

        <div className="profileedit-form-group">
          <label>생년월일</label>
          <input
            type="date"
            name="birthDate"
            value={form.birthDate}
            onChange={handleChange}
          />
        </div>

        <div className="profileedit-form-group">
          <label>성별</label>
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="">선택</option>
            <option value="M">남성</option>
            <option value="F">여성</option>
          </select>
        </div>

        {/* 추천인 ID - 모든 유저 수정 불가 */}
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