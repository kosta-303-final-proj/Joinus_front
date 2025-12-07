import React, { useEffect, useState } from "react";
import "./AddressList.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddressList() {
   const navigate = useNavigate();
  const [addressList, setAddressList] = useState([]);

  const getAddressList = () => {
    axios
      .get("http://localhost:8080"+`/mypage/address?username=ehgns0311`)
      .then((res) => {
        console.log(res.data);
        setAddressList(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getAddressList();
  }, []);

  const handleDelete = (name) => {
    if (window.confirm(`${name}님의 배송지를 삭제하시겠습니까?`)) {
      alert("삭제 기능은 아직 구현 전입니다.");
    }
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
                onClick={() => handleDelete(addr.recipientName)}
              >
                삭제
              </button>
            </div>
          </div>

          <div className="addresslist-detail">
            {addr.streetAddress} {addr.addressDetail} <br />
            {addr.phone} <br />
            출입방법: {addr.accessInstructions}
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