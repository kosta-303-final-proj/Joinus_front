import React from "react";
import "./MypageAlert.css";
      import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

export default function MypageAlert() {
  return (
    <>
      <h1 className="alert-title-main">알림</h1>

      <p className="alert-count">
        읽지 않은 알림이 <strong className="alert-blue">2개</strong> 있습니다.
      </p>

      {/* 리스트 */}
      <div className="alert-list">

        {/* 카드 1 */}
        <div className="alert-card alert-unread">
          <div className="alert-left">
            <div className="alert-icon">✉</div>
            <div>
              <div className="alert-title">
                공구 마감 임박 안내 <span className="alert-badge-new">NEW</span>
              </div>
              <div className="alert-text">
                “프리미엄 무선 이어폰” 공구 마감 3일 전입니다.
              </div>
              <div className="alert-date">공구 알림 · 2024.11.09 10:30</div>
            </div>
          </div>
          <button
            className="alert-btn-delete"
            onClick={() => alert("알림이 삭제되었습니다.")}
          >
            삭제
          </button>
        </div>

        {/* 카드 2 */}
        <div className="alert-card alert-unread">
          <div className="alert-left">
            <div className="alert-icon">✉</div>
            <div>
              <div className="alert-title">
                제안하신 상품이 공구로 전환되었습니다{" "}
                <span className="alert-badge-new">NEW</span>
              </div>
              <div className="alert-text">
                “스마트 워치 프로”가 공구로 전환되었습니다.
              </div>
              <div className="alert-date">공구 알림 · 2024.11.08 14:00</div>
            </div>
          </div>
          <button
            className="alert-btn-delete"
            onClick={() => alert("알림이 삭제되었습니다.")}
          >
            삭제
          </button>
        </div>

        {/* 카드 3 */}
        <div className="alert-card">
          <div className="alert-left">
            <div className="alert-icon">✉</div>
            <div>
              <div className="alert-title">배송 완료 안내</div>
              <div className="alert-text">
                상품 배송이 완료되었습니다. 포토리뷰 작성 시 500P 지급됩니다.
              </div>
              <div className="alert-date">배송 알림 · 2024.10.28 14:20</div>
            </div>
          </div>
          <button
            className="alert-btn-delete"
            onClick={() => alert("알림이 삭제되었습니다.")}
          >
            삭제
          </button>
        </div>

        {/* 카드 4 */}
        <div className="alert-card">
          <div className="alert-left">
            <div className="alert-icon">✉</div>
            <div>
              <div className="alert-title">회원 등급 상향 안내</div>
              <div className="alert-text">축하합니다! 골드 등급으로 승급되었습니다.</div>
              <div className="alert-date">등급 알림 · 2024.10.15 09:00</div>
            </div>
          </div>
          <button
            className="alert-btn-delete"
            onClick={() => alert("알림이 삭제되었습니다.")}
          >
            삭제
          </button>
        </div>

      </div>

            {/* 페이지네이션 */}
      <Pagination className="paginationContainer">
        <PaginationItem><PaginationLink first href="#" /></PaginationItem>
        <PaginationItem><PaginationLink previous href="#" /></PaginationItem>
        {[1,2,3,4,5].map(num => (
          <PaginationItem key={num}><PaginationLink href="#">{num}</PaginationLink></PaginationItem>
        ))}
        <PaginationItem><PaginationLink next href="#" /></PaginationItem>
        <PaginationItem><PaginationLink last href="#" /></PaginationItem>
      </Pagination>
      

      {/* 안내 박스 */}
      <div className="alert-info-box">
        <div className="alert-info-title">안내사항</div>
        • 알림은 30일 보관 후 자동 삭제됩니다.<br />
        • 삭제된 알림은 복구할 수 없습니다.
      </div>
    </>
  );
}
