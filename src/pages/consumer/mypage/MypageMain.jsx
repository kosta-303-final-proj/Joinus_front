import React from "react";
import "./MypageMain.css";

export default function MypageMain() {
  return (
    <>
      {/* 최근 주문 목록 */}
      <div className="main-card">
        <h3 className="main-card-title">
          최근 주문목록
          <a href="#" className="main-more">더보기 &gt;</a>
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

      {/* 관심상품 */}
      <div className="main-card">
        <h3 className="main-card-title">
          관심상품
          <a href="#" className="main-more">더보기 &gt;</a>
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

      {/* 참여중인 제안 */}
      <div className="main-card">
        <h3 className="main-card-title">
          참여중인 제안
          <a href="#" className="main-more">더보기 &gt;</a>
        </h3>

        <div className="main-product-item">
          <div className="main-thumb"></div>
          <div className="main-product-info">
            <p>친환경 주방세제 대용량 공구</p>
            <p>참여자 12명</p>
          </div>
        </div>

        <div className="main-product-item">
          <div className="main-thumb"></div>
          <div className="main-product-info">
            <p>애플워치 실리콘 밴드</p>
            <p>참여자 5명</p>
          </div>
        </div>
      </div>
    </>
  );
}
