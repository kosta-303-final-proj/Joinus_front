import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MypageProfileDetail.css";
import axios from "axios";

export default function MypageProfileDetail() {
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const username = userInfo?.username;

  const [data, setData] = useState({
    username: "",
    password: "************", // 마스킹
    name: "",
    nickname: "",
    phone: "",
    email: "",
    birthDate: "",
    gender: "",
    recommenderUsername: ""
  });

  // 프로필 정보 가져오기
  useEffect(() => {
     if (!username) return; // 🔒 안전장치
    axios
      .get(`http://localhost:8080/mypage/profile?username=${username}`)
      .then((res) => {
        const d = res.data;

        setData({
          username: d.username,
          password: "************",
          name: d.name,
          nickname: d.nickname,
          phone: d.phone,
          email: d.email,
          birthDate: d.birthDate,
          gender: d.gender,
          recommenderUsername: d.recommenderUsername
        });
      })
      .catch((err) => console.error(err));
  }, [username]);

  return (
    <>
      <div className="profiledetail-title-row">
        <div className="profiledetail-page-title">개인정보 관리</div>
      </div>

      <div className="profiledetail-info-box">

        {/* 아이디 */}
        <div className="profiledetail-form-group">
          <label>아이디</label>
          <input type="text" value={data.username} readOnly />
        </div>

        {/* 비밀번호 */}
        <div className="profiledetail-form-group">
          <label>비밀번호</label>
          <input type="password" value={data.password} readOnly />
        </div>

        {/* 이름 */}
        <div className="profiledetail-form-group">
          <label>이름</label>
          <input type="text" value={data.name} readOnly />
        </div>

        {/* 닉네임 */}
        <div className="profiledetail-form-group">
          <label>닉네임</label>
          <input type="text" value={data.nickname} readOnly />
        </div>

        {/* 연락처 */}
        <div className="profiledetail-form-group">
          <label>연락처</label>
          <input type="text" value={data.phone} readOnly />
        </div>

        {/* 이메일 */}
        <div className="profiledetail-form-group">
          <label>이메일</label>
          <input type="text" value={data.email} readOnly />
        </div>

        {/* 생년월일 */}
        <div className="profiledetail-form-group">
          <label>생년월일</label>
          <input type="text" value={data.birthDate} readOnly />
        </div>

        {/* 성별 */}
        <div className="profiledetail-form-group">
          <label>성별</label>
          <input
            type="text"
            value={
  data.gender === "M"
    ? "남성"
    : data.gender === "F"
    ? "여성"
    : ""
}

            readOnly
          />
        </div>

        {/* 추천인 */}
        <div className="profiledetail-form-group">
          <label>추천인 ID</label>
          <input type="text" value={data.recommenderUsername} readOnly />
        </div>

        {/* 버튼 */}
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
