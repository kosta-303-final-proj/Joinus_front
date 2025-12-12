import React, { useEffect, useState } from "react";
import "./MypageMain.css";
import { Link, useNavigate } from "react-router-dom";
import { myAxios } from "../../../config";

export default function MypageMain() {
  const navigate = useNavigate();

  // ===============================
  // 공동구매 요청 (대시보드용)
  // ===============================
  const [suggestions, setSuggestions] = useState([]);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const username = userInfo?.username;

  useEffect(() => {
    if (!username) return;

    myAxios()
      .get(`/mypage/dashboard/suggestions?username=${username}`)
      .then((res) => {
        // 최대 5개만 사용
        setSuggestions(res.data.slice(0, 5));
      })
      .catch((err) => {
        console.error("대시보드 공동구매 조회 실패", err);
        setSuggestions([]);
      });
  }, [username]);

  return (
    <>
      {/* ================= 최근 주문 목록 ================= */}
      <div className="main-card">
        <h3 className="main-card-title">
          최근 주문목록
          <Link to="/mypage/orderList" className="main-more">
            더보기 &gt;
          </Link>
        </h3>

        <table className="main-table">
          <thead>
            <tr>
              <th>주문번호</th>
              <th>상품명</th>
              <th>주문일자</th>
              <th>결제금액</th>
              <th>상태</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>ORD-20251108-001</td>
              <td>천연 텀블러 500ml</td>
              <td>2025-11-08</td>
              <td>₩32,000</td>
              <td>배송중</td>
            </tr>

            <tr>
              <td>ORD-20251103-004</td>
              <td>해외 직구 커피머신</td>
              <td>2025-11-03</td>
              <td>₩189,000</td>
              <td>배송완료</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ================= 관심상품 ================= */}
      <div className="main-card">
        <h3 className="main-card-title">
          관심상품
          <Link to="/mypage/interestList" className="main-more">
            더보기 &gt;
          </Link>
        </h3>

        <div className="main-product-item">
          <div className="main-thumb"></div>
          <div className="main-product-info">
            <p>프리미엄 원두커피 1kg</p>
            <p>₩19,900</p>
          </div>
        </div>

        <div className="main-product-item">
          <div className="main-thumb"></div>
          <div className="main-product-info">
            <p>스테인리스 텀블러 350ml</p>
            <p>₩12,500</p>
          </div>
        </div>
      </div>

      {/* ================= 공동구매 요청 ================= */}
      <div className="main-card">
        <h3 className="main-card-title">
          공동구매 요청
          <Link to="/mypage/suggestions" className="main-more">
            더보기 &gt;
          </Link>
        </h3>

        {suggestions.length === 0 && (
          <div className="main-product-item">
            <div className="main-product-info">
              <p>참여 중인 공동구매가 없습니다.</p>
            </div>
          </div>
        )}

        {suggestions.map((item) => (
          <div
            key={item.suggestionId}
            className="main-product-item"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/suggestions/${item.suggestionId}`)}
          >
            <div className="main-thumb"></div>
            <div className="main-product-info">
              <p>{item.title}</p>
              <p>참여자 {item.participantCount}명</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
