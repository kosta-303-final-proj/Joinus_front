import React from "react";
import "./AddressList.css";
import { Link, useNavigate } from "react-router-dom";

export default function AddressList() {
  const navigate = useNavigate();

  const handleDelete = (name) => {
    if (window.confirm(`${name}님의 배송지를 삭제하시겠습니까?`)) {
      alert("배송지가 삭제되었습니다.");
    }
  };

  return (
    <>
      {/* 페이지 제목 */}
      <div className="addresslist-page-title">배송지 관리</div>

      {/* ==================== 배송지 카드 1 ==================== */}
      <div className="addresslist-card">
        <div className="addresslist-header">
          <h3>
            박민수
            <span className="addresslist-label">집</span>
            <span className="addresslist-badge-default">기본배송지</span>
          </h3>

          <div className="addresslist-btn-group">
            <button
              className="addresslist-btn-edit"
              onClick={() => navigate("/mypage/addressEdit/1")}
            >
              수정
            </button>

            <button
              className="addresslist-btn-delete"
              onClick={() => handleDelete("박민수")}
            >
              삭제
            </button>
          </div>
        </div>

        <div className="addresslist-detail">
          서울특별시 강남구 논현로 145길 18, 힐스테이트 논현 103동 701호 <br />
          010-5241-8372 <br />
          출입방법: 공동현관 비밀번호(1234) 입력 후 출입 가능
        </div>
      </div>

      {/* ==================== 배송지 카드 2 ==================== */}
      <div className="addresslist-card">
        <div className="addresslist-header">
          <h3>
            김유진
            <span className="addresslist-label">회사</span>
          </h3>

          <div className="addresslist-btn-group">
            <button className="addresslist-btn-edit">수정</button>

            <button
              className="addresslist-btn-delete"
              onClick={() => handleDelete("김유진")}
            >
              삭제
            </button>
          </div>
        </div>

        <div className="addresslist-detail">
          경기도 성남시 분당구 판교로 232, 블루힐 오피스텔 509호 <br />
          010-3981-2570 <br />
          출입방법: 경비실 통해 출입 가능
        </div>
      </div>

      {/* ==================== 배송지 카드 3 ==================== */}
      <div className="addresslist-card">
        <div className="addresslist-header">
          <h3>
            정하늘
            <span className="addresslist-label">자취방</span>
          </h3>

          <div className="addresslist-btn-group">
            <button className="addresslist-btn-edit">수정</button>

            <button
              className="addresslist-btn-delete"
              onClick={() => handleDelete("정하늘")}
            >
              삭제
            </button>
          </div>
        </div>

        <div className="addresslist-detail">
          부산광역시 해운대구 좌동로 87, 더베이아파트 103동 1203호 <br />
          010-9324-9911 <br />
          출입방법: 자유 출입 가능
        </div>
      </div>

      {/* 추가 버튼 */}
      <div className="addresslist-add">
        <Link to="/mypage/addressAdd" style={{ textDecoration: "none" }}>
          <span>＋ 배송지 추가</span>
        </Link>
      </div>
    </>
  );
}
