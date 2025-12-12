import React, { useEffect, useState } from "react";
import "./MypagePoints.css";
import { Label, FormGroup, Input, Button, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import axios from "axios";
export default function MypagePoints() {

  // ✅ 로그인 유저 정보 (반드시 최상단)
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const username = userInfo?.username;

  const [tab, setTab] = useState("all");
  const [pointList, setPointList] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const reasonText = {
    SIGNUP: "회원가입 축하 포인트 적립",
    SIGNUP_WITH_RECOMMENDER: "추천인 입력 포인트 적립",
    RECOMMEND_REWARD: "추천인 보상 포인트 적립",
    REVIEW: "텍스트 리뷰 포인트 적립",
    PHOTO_REVIEW: "포토 리뷰 포인트 적립",
    PROPOSAL_APPROVED: "공동구매 제안 승인 포인트 적립",
    SHARE_PURCHASE: "공동구매 공유 포인트 적립",
    PURCHASE: "구매 포인트 적립",
    USE: "포인트 사용",
    CANCEL_REFUND: "주문취소/교환,반품 포인트 회수",
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return dateString.slice(0, 10);
  };

  const getPointList = () => {
    if (!username) return; // 🔒 안전장치

    axios
      .get(`http://localhost:8080/mypage/point?username=${username}`)
      .then((res) => {
        setPointList(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getPointList();
  }, [username]);

  // 필터링
  const filteredList = pointList.filter((p) => {
    if (tab === "save") return !p.amount.startsWith("-");
    if (tab === "use") return p.amount.startsWith("-");
    return true;
  });

  // 페이징
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNum) => {
    if (pageNum < 1 || pageNum > totalPages) return;
    setCurrentPage(pageNum);
  };

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
{currentItems.map((p) => (
    <div className="points-item" key={p.id}>
      <div className="points-info">
         {/* reason_type 한국어로 출력 */}
              {reasonText[p.reason_type] || p.reason_type}

              <div className="points-date">
                {/* 날짜 포맷 변경 */}
                {formatDate(p.created_at)} | 주문번호 {p.order_id}
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

    {/* 페이징 UI */}
      <Pagination className="paginationContainer">
        <PaginationItem disabled={currentPage === 1}>
          <PaginationLink first onClick={() => handlePageChange(1)} />
        </PaginationItem>

        <PaginationItem disabled={currentPage === 1}>
          <PaginationLink previous onClick={() => handlePageChange(currentPage - 1)} />
        </PaginationItem>

        {[...Array(totalPages)].map((_, i) => (
          <PaginationItem key={i} active={currentPage === i + 1}>
            <PaginationLink onClick={() => handlePageChange(i + 1)}>
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem disabled={currentPage === totalPages}>
          <PaginationLink next onClick={() => handlePageChange(currentPage + 1)} />
        </PaginationItem>

        <PaginationItem disabled={currentPage === totalPages}>
          <PaginationLink last onClick={() => handlePageChange(totalPages)} />
        </PaginationItem>
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
