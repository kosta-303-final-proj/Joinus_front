import React, { useEffect, useState } from "react";
import "./MypagePoints.css";
import {
  Pagination,
  PaginationItem,
  PaginationLink
} from "reactstrap";
import axios from "axios";

export default function MypagePoints() {

  // ✅ 로그인 유저 정보
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  const username = userInfo?.username;

  const [tab, setTab] = useState("all");
  const [pointList, setPointList] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 날짜 포맷
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return dateString.slice(0, 10);
  };

  // 포인트 목록 조회
  const getPointList = () => {
    if (!username) return;

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

  // ✅ 필터링 (amount는 number)
  const filteredList = pointList.filter((p) => {
    if (tab === "save") return p.amount > 0;
    if (tab === "use") return p.amount < 0;
    return true;
  });

  // 페이징 계산
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
          onClick={() => {
            setTab("all");
            setCurrentPage(1);
          }}
        >
          전체
        </button>

        <button
          className={tab === "save" ? "active" : ""}
          onClick={() => {
            setTab("save");
            setCurrentPage(1);
          }}
        >
          적립
        </button>

        <button
          className={tab === "use" ? "active" : ""}
          onClick={() => {
            setTab("use");
            setCurrentPage(1);
          }}
        >
          사용
        </button>
      </div>

      {/* 포인트 목록 */}
      <div className="points-list">
        {currentItems.length === 0 && (
          <div className="points-empty">포인트 내역이 없습니다.</div>
        )}

        {currentItems.map((p) => (
          <div className="points-item" key={p.id}>
            <div className="points-info">
         {p.reasonText}
<div className="points-date">
  {formatDate(p.createdAt)}
  {p.orderId && (
    <> | 주문번호 {p.orderId}</>
  )}
</div>

            </div>

            {/* 금액 표시 */}
{p.amount < 0 ? (
  <div className="points-minus">
    {Number(p.amount || 0).toLocaleString()}P
  </div>
) : (
  <div className="points-plus">
    +{Number(p.amount || 0).toLocaleString()}P
  </div>
)}


          </div>
        ))}
      </div>

      {/* 페이징 */}
      {totalPages > 1 && (
        <Pagination className="paginationContainer">
          <PaginationItem disabled={currentPage === 1}>
            <PaginationLink first onClick={() => handlePageChange(1)} />
          </PaginationItem>

          <PaginationItem disabled={currentPage === 1}>
            <PaginationLink
              previous
              onClick={() => handlePageChange(currentPage - 1)}
            />
          </PaginationItem>

          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i} active={currentPage === i + 1}>
              <PaginationLink onClick={() => handlePageChange(i + 1)}>
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem disabled={currentPage === totalPages}>
            <PaginationLink
              next
              onClick={() => handlePageChange(currentPage + 1)}
            />
          </PaginationItem>

          <PaginationItem disabled={currentPage === totalPages}>
            <PaginationLink last onClick={() => handlePageChange(totalPages)} />
          </PaginationItem>
        </Pagination>
      )}

      {/* 안내 박스 */}
      <div className="points-info-box">
        <span>포인트 적립 및 사용 안내</span>
        <br />
        · 회원가입 시 1회 1,000P가 적립됩니다.<br />
        · 회원 등급에 따라 구매 금액의 일정 비율이 포인트로 적립됩니다.<br />
        · 제안이 공구로 승인될 경우 포인트가 지급됩니다.<br />
        · 리뷰 작성 시 포인트가 적립됩니다.<br />
        · 추천인 코드로 회원가입 시 포인트가 적립됩니다.<br />
        · 적립된 포인트는 상품 구매 시 사용 가능합니다.<br />
        · 환불 처리 시 사용한 포인트는 자동 반환됩니다.<br />
        · 포인트는 1,000P 이상부터 사용 가능합니다.
      </div>
    </>
  );
}
