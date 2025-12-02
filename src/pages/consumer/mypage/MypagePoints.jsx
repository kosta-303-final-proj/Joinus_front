import React, { useState } from "react";
import "./MypagePoints.css";
import { Label, FormGroup, Input, Button, Pagination, PaginationItem, PaginationLink } from "reactstrap";

export default function MypagePoints() {
  const [tab, setTab] = useState("all");

  return (
    <>
      {/* 제목 */}
      <div className="points-title">포인트</div>

      {/* 탭 메뉴 */}
      <div className="points-tab-menu">
        <button
          className={tab === "all" ? "active" : ""}
          onClick={() => setTab("all")}
        >
          전체
        </button>

        <button
          className={tab === "save" ? "active" : ""}
          onClick={() => setTab("save")}
        >
          적립
        </button>

        <button
          className={tab === "use" ? "active" : ""}
          onClick={() => setTab("use")}
        >
          사용
        </button>
      </div>

      {/* 포인트 목록 */}
      <div className="points-list">

        {(tab === "all" || tab === "save") && (
          <>
            <div className="points-item">
              <div className="points-info">
                포인트 적립
                <div className="points-date">2024.11.01 | 주문번호 ORD-2024-001</div>
              </div>
              <div className="points-plus">+150P</div>
            </div>

            <div className="points-item">
              <div className="points-info">
                포토 리뷰
                <div className="points-date">2024.11.05 | 주문번호 ORD-2024-004</div>
              </div>
              <div className="points-plus">+500P</div>
            </div>

            <div className="points-item">
              <div className="points-info">
                공구 전환
                <div className="points-date">2024.11.03 | 참여번호 #CG-021</div>
              </div>
              <div className="points-plus">+1,000P</div>
            </div>
          </>
        )}

        {(tab === "all" || tab === "use") && (
          <>
            <div className="points-item">
              <div className="points-info">
                포인트 소멸
                <div className="points-date">2024.11.10 | 유효기간 만료</div>
              </div>
              <div className="points-minus">-1,200P</div>
            </div>

            <div className="points-item">
              <div className="points-info">
                포인트 사용
                <div className="points-date">2024.11.10 | 주문번호 ORD-2024-005</div>
              </div>
              <div className="points-minus">-500P</div>
            </div>
          </>
        )}
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
      <div className="points-info-box">
        <span>포인트 적립 및 사용 안내</span>
        · 회원가입 시 1회 1,000P 적립됩니다.<br />
        · 회원등급에 따라 구매금액의 일정 비율이 적립됩니다.<br />
        · 자신이 제안한 건 공구 전환 시 1,000P 적립됩니다.<br />
        · 리뷰 작성 시 (글 300P, 포토 500P) 적립됩니다.<br />
        · 추천인 회원가입 시 500P 적립됩니다.<br />
        · 포인트는 구매 시 사용 가능합니다.<br />
        · 유효기간은 적립 후 1년입니다.<br />
        · 환불 시 사용 포인트는 반환됩니다.<br />
        · 최소 사용 포인트 1,000P부터 적용됩니다.<br />
      </div>
    </>
  );
}
