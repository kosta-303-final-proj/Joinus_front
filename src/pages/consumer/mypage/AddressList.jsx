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

const handleAddAddress = () => {
  if (addressList.length >= 3) {
    alert("배송지는 최대 3개까지 등록할 수 있습니다.\n기존 배송지를 삭제해주세요.");
    return;
  }
  navigate("/mypage/addressAdd");
};

  const getAddressList = () => {
    if (!username) return;

    axios
      .get(`http://localhost:8080/mypage/address?username=${username}`)
      .then((res) => {
        setAddressList(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getAddressList();
  }, [username]);

  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    await axios.delete(`http://localhost:8080/mypage/address/${id}`);

    alert("삭제되었습니다.");
    getAddressList();
  };

  return (
    <>
      {/* 페이지 제목 */}
      <div className="addresslist-page-title">배송지 관리</div>

      {/* 배송지 목록 */}
      {addressList.map((addr) => (
        <div className="addresslist-card" key={addr.id}>
          <div className="addresslist-header">
            <h3>
              {addr.recipientName}
              <span className="addresslist-label">{addr.addressName}</span>

              {/* ✅ 기본배송지 표시 (이미 잘 구현돼 있음) */}
             {addr.isDefault && (
  <span className="addresslist-badge-default">
    기본배송지
  </span>
)}

            </h3>

            <div className="addresslist-btn-group">
              <button
                className="addresslist-btn-edit"
                onClick={() =>
                  navigate(`/mypage/addressEdit/${addr.id}`)
                }
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

          {/* ✅ 주소 출력 형식 통일 */}
          <div className="addresslist-detail">
            [{addr.postcode}] {addr.streetAddress} {addr.addressDetail}
            <br />
            {addr.phone}
            <br />
            출입방법 : {addr.accessInstructions}
          </div>
        </div>
      ))}


      {/* 추가 버튼 */}
     <div className="addresslist-add">
  <span onClick={handleAddAddress} style={{ cursor: "pointer" }}>
    ＋ 배송지 추가
  </span>
</div>
    </>
  );
}