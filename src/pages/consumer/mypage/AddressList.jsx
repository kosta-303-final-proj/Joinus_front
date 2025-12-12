import React, { useEffect, useState } from "react";
import "./AddressList.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddressList() {
   const navigate = useNavigate();
  const [addressList, setAddressList] = useState([]);

   // ✅ 로그인 유저 정보
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const username = userInfo?.username;
  
  const getAddressList = () => {
    if (!username) return; // 🔒 안전장치
    axios
      .get(`http://localhost:8080/mypage/point?username=${username}`)
      .then((res) => {
        console.log(res.data);
        setAddressList(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getAddressList();
  }, []);

const handleDelete = async (id) => {
  if (!window.confirm("정말 삭제하시겠습니까?")) return;

  await axios.delete(`http://localhost:8080/mypage/address/${id}`);

  alert("삭제되었습니다.");
  getAddressList(); // 목록 새로고침
};


  return (
    <>
      {/* 페이지 제목 */}
      <div className="addresslist-page-title">배송지 관리</div>

      {/* ===================== 배송지 목록 출력 ===================== */}
      {addressList.map((addr) => (
        <div className="addresslist-card" key={addr.id}>
          <div className="addresslist-header">
            <h3>
              {addr.recipientName}
              <span className="addresslist-label">{addr.addressName}</span>

              {addr.isDefault === true && (
                <span className="addresslist-badge-default">기본배송지</span>
              )}
            </h3>

            <div className="addresslist-btn-group">
              <button
                className="addresslist-btn-edit"
                onClick={() => navigate(`/mypage/addressEdit/${addr.id}`)}
              >
                수정
              </button>

             <button
  className="addresslist-btn-delete"
  onClick={() => handleDelete(addr.id)}
>
  삭제
</button>

            </div>
          </div>

          <div className="addresslist-detail">
            {addr.streetAddress} {addr.addressDetail} <br />
            {addr.phone} <br />
            출입방법 : {addr.accessInstructions}
          </div>
        </div>
      ))}

      {/* 추가 버튼 */}
      <div className="addresslist-add">
        <Link to="/mypage/addressAdd" style={{ textDecoration: "none" }}>
          <span>＋ 배송지 추가</span>
        </Link>
      </div>
    </>
  );
}