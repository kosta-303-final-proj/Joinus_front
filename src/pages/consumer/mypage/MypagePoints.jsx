import React, { useEffect, useState } from "react";
import "./MypagePoints.css";
import { Label, FormGroup, Input, Button, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import axios from "axios";

export default function MypagePoints() {
  const [tab, setTab] = useState("all");
  const [pointList, setPointList] = useState([]);

  const getPointList = () => {
    axios
    .get("http://localhost:8080"+`/mypage/point?username=ehgns0311`)
    .then((res)=> {
      console.log(res.data);
      setPointList(res.data); 
    })
      .catch((err) => {
      console.log(err);
      });
  };
useEffect(()=> {
  getPointList();
},[]);

const filteredList = pointList.filter((p) => {
  if (tab === "save") return !p.amount.startsWith("-");   // 적립만
  if (tab === "use") return p.amount.startsWith("-");     // 사용만
  return true; // 전체
});

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
{filteredList.map((p) => (
    <div className="points-item" key={p.id}>
      <div className="points-info">
        {p.reason_type}
        <div className="points-date">
          {p.created_at} | 주문번호 {p.order_id}
        </div>
      </div>

      {/* 금액 + / - 표시 */}
      {p.amount.startsWith("-") ? (
        <div className="points-minus">{p.amount}P</div>
      ) : (
        <div className="points-plus">{p.amount}P</div>
      )}
    </div>
  ))}
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
    · 회원가입 시 1회 1,000P가 적립됩니다.<br/>
    · 회원 등급에 따라 구매 금액의 일정 비율이 포인트로 적립됩니다.<br/>
    · 본인이 제안한 건이 공구로 전환될 경우 1,000P가 적립됩니다.<br/>
    · 리뷰 작성 시 포인트가 적립됩니다. (텍스트 300P, 포토 리뷰 500P)<br/>
    · 추천인 코드로 회원가입할 경우 500P가 적립됩니다.<br/>
    · 소셜 공유 링크를 통해 다른 사용자가 구매를 완료하면 500P가 적립됩니다.<br/>
    · 적립된 포인트는 상품 구매 시 사용할 수 있습니다.<br/>
    · 환불 처리 시 사용한 포인트는 자동으로 반환됩니다.<br/>
    · 포인트는 1,000P 이상부터 사용 가능합니다.<br/>
      </div>

    </>
  );
}
