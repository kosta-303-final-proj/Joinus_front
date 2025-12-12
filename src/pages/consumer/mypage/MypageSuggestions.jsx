import React, { useEffect, useState } from "react";
import "./MypageSuggestions.css";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { myAxios } from "../../../config";

export default function MypageSuggestions() {
  const [tab, setTab] = useState("participated");

  const [participatedList, setParticipatedList] = useState([]);
  const [writtenList, setWrittenList] = useState([]);

  // ✅ 페이지 상태
  const [participatedPage, setParticipatedPage] = useState(1);
  const [writtenPage, setWrittenPage] = useState(1);

  const itemsPerPage = 10;

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const username = userInfo?.username;

  // ===============================
  // 데이터 조회
  // ===============================
  useEffect(() => {
    if (!username) return;

    myAxios()
      .get(`/mypage/suggestions/participated?username=${username}`)
      .then((res) => setParticipatedList(res.data || []));

    myAxios()
      .get(`/mypage/suggestions/written?username=${username}`)
      .then((res) => setWrittenList(res.data || []));
  }, [username]);

  // ✅ 탭 변경 시 페이지 초기화 (강력추천)
  useEffect(() => {
    setParticipatedPage(1);
    setWrittenPage(1);
  }, [tab]);

  // ===============================
  // 페이징 계산
  // ===============================
  const currentList = tab === "participated" ? participatedList : writtenList;
  const currentPage = tab === "participated" ? participatedPage : writtenPage;
  const setCurrentPage =
    tab === "participated" ? setParticipatedPage : setWrittenPage;

  const totalPages = Math.ceil(currentList.length / itemsPerPage);

  const currentItems = currentList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <>
      <div className="suggestions-title">공동구매 요청</div>

      {/* 탭 */}
      <div className="suggestions-tab-menu">
        <button
          className={tab === "participated" ? "active" : ""}
          onClick={() => setTab("participated")}
        >
          내가 투표한 공동 구매
        </button>
        <button
          className={tab === "written" ? "active" : ""}
          onClick={() => setTab("written")}
        >
          내가 요청한 공동 구매
        </button>
      </div>

      {/* 리스트 */}
      <div className="suggestions-group-list">
        {currentItems.map((item) => (
          <div className="suggestions-card" key={item.id}>
            <div className="suggest-card-img">
              <img src={item.imageUrl || "/default.png"} alt="" />
            </div>

            <div className="card-info">
              <div>
                <div className="category">{item.category}</div>
                <div className="title">{item.productName}</div>
                <div className="desc">{item.description}</div>
                <div className="votes">
                  참여 투표 인원수: {item.voteCount}명
                </div>
              </div>

              <div className="card-actions">
                <button className="btn-detail">상세보기</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
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
    </>
  );
}
