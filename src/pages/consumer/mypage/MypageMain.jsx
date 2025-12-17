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

  // ===============================
  // 최근 주문 목록 (대시보드용)
  // ===============================
  const [recentOrders, setRecentOrders] = useState([]);


  // ===============================
  // 관심상품 (Wishlist 대시보드용)
  // ===============================
  const [wishlist, setWishlist] = useState([]);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const username = userInfo?.username;

useEffect(() => {
  if (!username) return;

  myAxios()
    .get("/orderList", {
      params: {
        username,
        page: 0,
        size: 5,
      },
    })
    .then((res) => {
      setRecentOrders(res.data.content || []);
    })
    .catch((err) => {
      console.error("대시보드 최근 주문 조회 실패", err);
      setRecentOrders([]);
    });
}, [username]);


  // ===============================
  // 공동구매 요청 TOP 5
  // ===============================
  useEffect(() => {
    if (!username) return;

    myAxios()
      .get(`/mypage/dashboard/suggestions?username=${username}`)
      .then((res) => {
        setSuggestions(res.data.slice(0, 5));
      })
      .catch((err) => {
        console.error("대시보드 공동구매 조회 실패", err);
        setSuggestions([]);
      });
  }, [username]);

  // ===============================
  // 관심상품 TOP 5
  // ===============================
  useEffect(() => {
    if (!username) return;

    myAxios()
      .get(`/mypage/dashboard/wishlist?username=${username}`)
      .then((res) => {
        setWishlist(res.data); // 이미 5개만 내려옴
      })
      .catch((err) => {
        console.error("대시보드 관심상품 조회 실패", err);
        setWishlist([]);
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
  {recentOrders.length === 0 ? (
    <tr>
      <td colSpan="5" style={{ textAlign: "center" }}>
        최근 주문 내역이 없습니다.
      </td>
    </tr>
  ) : (
    recentOrders.map((order) => (
      <tr
        key={order.id}
        style={{ cursor: "pointer" }}
        onClick={() => navigate(`/mypage/orderList/orderDetail/${order.id}`)}
      >
        <td>{order.id}</td>
        <td>{order.productName}</td>
        <td>{order.createdAt?.substring(0, 10)}</td>
        <td>₩{order.productPrice?.toLocaleString()}</td>
        <td>{order.status}</td>
      </tr>
    ))
  )}
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

        {wishlist.length === 0 && (
          <div className="main-product-item">
            <div className="main-product-info">
              <p>관심상품이 없습니다.</p>
            </div>
          </div>
        )}

        {wishlist.map((item) => (
          <div
            key={item.id}
            className="main-product-item"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/gbProductDetail/${item.gbProductId}`)}

          >
            <div
              className="main-thumb"
              style={{
                backgroundImage: item.file
                  ? `url(/file/${item.file.id})`
                  : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="main-product-info">
              <p>{item.product.name}</p>
              <p>₩{item.product.price.toLocaleString()}</p>
            </div>
          </div>
        ))}
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
           key={item.id}
            className="main-product-item"
            style={{ cursor: "pointer" }}
        onClick={() => navigate(`/proposalDetail/${item.id}`)}
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
