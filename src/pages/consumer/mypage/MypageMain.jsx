import React, { useEffect, useState } from "react";
import "./MypageMain.css";
import { Link, useNavigate } from "react-router-dom";
import { myAxios, baseUrl } from "../../../config";

export default function MypageMain() {

  /* ===============================
     주문 상태 매핑 (기존 코드 유지)
     =============================== */
  const ORDER_STATUS_MAP = {
    READY: "결제대기",
    PAID: "결제완료",
    PREPARING: "상품준비중",
    SHIPPING: "배송중",
    DELIVERED: "배송완료",
    CANCELLED: "취소완료",
    COLLECTING: "상품회수중",
    EXCHANGE_REQUESTED: "교환신청",
    EXCHANGE_PREPARATION: "교환준비",
    EXCHANGE_RETRIEVAL: "교환회수중",
    EXCHANGE_SHIPPING: "교환배송중",
    EXCHANGE_REJECTED: "교환거절",
    EXCHANGE_COMPLETED: "교환완료",
    RETURN_REQUESTED: "반품신청",
    RETURN_PREPARATION: "반품준비",
    RETURNS_RETRIEVAL: "반품회수중",
    RETURN_REJECTED: "반품거절",
    RETURN_COMPLETED: "반품완료",
  };

  const getOrderStatusLabel = (status) => {
    return ORDER_STATUS_MAP[status] || status;
  };

  const navigate = useNavigate();

  /* ===============================
     상태 값들 (기존 코드 유지)
     =============================== */
  const [suggestions, setSuggestions] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistTimeMap, setWishlistTimeMap] = useState({});

  /* ===============================
     endDate 파싱 함수 (기존 유지)
     =============================== */
  const parseEndDate = (endDate) => {
    if (!endDate) return null;

    if (typeof endDate === "object" && endDate.time) {
      return endDate.time;
    }

    if (typeof endDate === "string") {
      return new Date(endDate.replace(" ", "T")).getTime();
    }

    return null;
  };

  /* ===============================
     로그인 유저 정보
     =============================== */
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  const username = userInfo?.username;

  /* ===============================
     최근 주문 목록 TOP 5
     =============================== */
  useEffect(() => {
    if (!username) return;

    myAxios()
      .get("/mypage/orderList/recent", {
        params: { username, limit: 5 },
      })
      .then((res) => {
        setRecentOrders(res.data || []);
      })
      .catch((err) => {
        console.error("최근 주문 목록 조회 실패", err);
        setRecentOrders([]);
      });
  }, [username]);

  /* ===============================
     공동구매 요청 TOP 5
     =============================== */
  useEffect(() => {
    if (!username) return;

    myAxios()
      .get(`/mypage/dashboard/suggestions`, {
        params: { username },
      })
      .then((res) => {
        setSuggestions(res.data?.slice(0, 5) || []);
      })
      .catch((err) => {
        console.error("대시보드 공동구매 조회 실패", err);
        setSuggestions([]);
      });
  }, [username]);

  /* ===============================
     관심상품 TOP 5
     =============================== */
  useEffect(() => {
    if (!username) return;

    myAxios()
      .get(`/mypage/dashboard/wishlist`, {
        params: { username },
      })
      .then((res) => {
        setWishlist(res.data || []);
      })
      .catch((err) => {
        console.error("대시보드 관심상품 조회 실패", err);
        setWishlist([]);
      });
  }, [username]);

  /* ===============================
     날짜 포맷 (기존 유지)
     =============================== */
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return String(dateStr).substring(0, 10);
  };

  /* ===============================
     관심상품 실시간 타이머
     =============================== */
  useEffect(() => {
    if (wishlist.length === 0) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const updated = {};

      wishlist.forEach((item) => {
        if (!item.product) {
          updated[item.id] = "정보 없음";
          return;
        }

        const endTime = parseEndDate(item.product.endDate);

        if (!endTime) {
          updated[item.id] = "날짜 없음";
          return;
        }

        const diff = endTime - now;

        if (diff <= 0) {
          updated[item.id] = "종료";
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        updated[item.id] =
          `${days}일 ${hours}시간 ${minutes}분 ${seconds}초`;
      });

      setWishlistTimeMap(updated);
    }, 1000);

    return () => clearInterval(interval);
  }, [wishlist]);

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

        <table className="main-table fixed">
          <colgroup>
  <col style={{ width: "16%" }} />   {/* 주문번호 */}
  <col style={{ width: "36%" }} />   {/* 상품정보 */}
  <col style={{ width: "14%" }} />   {/* 주문일자 */}
  <col style={{ width: "14%" }} />   {/* 결제금액 */}
  <col style={{ width: "20%" }} />   {/* 상태 */}
</colgroup>


          <thead>
  <tr>
    <th>주문번호</th>
    <th>상품정보</th>
    <th>주문일자</th>
    <th>결제금액</th>
    <th>상태</th>
  </tr>
</thead>


          <tbody>
  {recentOrders.length === 0 ? (
    <tr>
      <td colSpan="5" className="empty">
        주문 내역이 없습니다.
      </td>
    </tr>
  ) : (
    recentOrders.map((order) => (
      <tr
        key={order.orderId}
        className="order-row"
        onClick={() =>
          navigate(`/mypage/orderList/orderDetail/${order.orderId}`)
        }
      >
        {/* 주문번호 */}
        <td className="center nowrap">{order.orderId}</td>

        {/* 상품정보 */}
        <td>
          <div className="order-product-cell">
            <img
              className="order-thumb"
              src={
                order.thumbnailFileName
                  ? `${baseUrl}/file/order/${order.thumbnailFileName}`
                  : "/default.png"
              }
              alt=""
            />
            <span className="order-product-name">
              {order.productName}
            </span>
          </div>
        </td>

        {/* 주문일자 */}
        <td className="center nowrap">
          {formatDate(order.orderedAt)}
        </td>

        {/* 결제금액 */}
    <td className="right nowrap">
  {order.totalAmount?.toLocaleString()}원
</td>

        {/* 상태 */}
        <td className="center nowrap">
          {getOrderStatusLabel(order.status)}
        </td>
      </tr>
    ))
  )}
</tbody>

        </table>
      </div> {/* ❗ 누락돼 있던 main-card 닫기 div (필수 수정) */}

      {/* ================= 관심상품 ================= */}
      <div className="main-card">
        <h3 className="main-card-title">
          관심상품
          <Link to="/mypage/interestList" className="main-more">
            더보기 &gt;
          </Link>
        </h3>

        {wishlist.length === 0 ? (
          <div className="main-product-item">
            <div className="main-product-info">
              <p>관심상품이 없습니다.</p>
            </div>
          </div>
        ) : (
          wishlist.map((item) => {
            const wishId = item.id;

            return (
              <div
                key={`wishlist-${wishId}`}
                className="main-product-item"
                onClick={(e) => {
                  if (!item.product?.id) return;
                  navigate(`/gbProductDetail/${item.product.id}`);
                }}
              > {/* ❗ 여기 닫는 '>' 누락돼 있었음 → JSX 에러 원인 */}

                {/* 왼쪽 영역 */}
                <div className="wishlist-left">
                  <div className="main-thumb">
                    <img
                      src={
                        item.product?.thumbnail?.fileName
                          ? `${baseUrl}/file/gbProduct/${item.product.thumbnail.fileName}`
                          : "/default.png"
                      }
                      alt=""
                    />
                  </div>

                  <div className="main-product-info">
                    <p className="wishlist-name">
                      {item.product?.name || "상품명 없음"}
                    </p>
                    <p className="wishlist-price">
                      {item.product?.price
                        ? `${item.product.price.toLocaleString()}원`
                        : "가격 정보 없음"}
                    </p>
                  </div>
                </div>

                {/* 오른쪽 영역 */}
                <div className="wishlist-right">
                  <div className="wishlist-deadline">
                    마감일: {formatDate(item.product?.endDate)}
                  </div>
                  <div className="wishlist-timer">
                    {wishlistTimeMap[wishId] ?? "계산 중"}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ================= 공동구매 요청 ================= */}
      <div className="main-card">
        <h3 className="main-card-title">
          투표한 공동 구매
          <Link to="/mypage/suggestions" className="main-more">
            더보기 &gt;
          </Link>
        </h3>

        {suggestions.length === 0 ? (
          <div className="main-product-item">
            <div className="main-product-info">
              <p>참여 중인 공동구매가 없습니다.</p>
            </div>
          </div>
        ) : (
          suggestions.map((item) => (
            <div
              key={`suggestion-item-${item.id}`}
              className="main-product-item"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/proposalDetail/${item.id}`)}
            >
              <div className="main-thumb">
                <img
                  src={
                    "http://localhost:8080/imageView?filename=" +
                      item.imageUrl || "/default.png"
                  }
                  alt=""
                />
              </div>
              <div className="main-product-info">
                <p>{item.title || item.productName}</p>
                <p>참여자 {item.voteCount || 0}명</p>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
