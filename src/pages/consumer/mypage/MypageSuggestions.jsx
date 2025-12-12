import React, { useEffect, useState } from "react";
import "./MypageSuggestions.css";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

export default function MypageSuggestions() {
  const [tab, setTab] = useState("participated");
  const [participatedList, setParticipatedList] = useState([]);
  const [writtenList, setWrittenList] = useState([]);

  // 로그인 유저 정보 가져오기
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const username = userInfo?.username;

  // 참여한 공구 불러오기
  const fetchParticipated = () => {
    if (!username) return;

    fetch(`/mypage/suggestions/participated?username=${username}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("참여한 공구:", data);
        setParticipatedList(data);
      })
      .catch((err) => console.error(err));
  };

  // 내가 작성한 공구 불러오기
  const fetchWritten = () => {
    if (!username) return;

    fetch(`/mypage/suggestions/written?username=${username}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("내가 작성한 공구:", data);
        setWrittenList(data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchParticipated();
    fetchWritten();
  }, []);

  return (
    <>
      <div className="suggestions-title">공동구매 요청</div>

      {/* ================= 탭 메뉴 ================= */}
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

      {/* ================= 리스트 ================= */}
      <div className="suggestions-group-list">

        {/* 참여한 공구 */}
        {tab === "participated" &&
          participatedList.map((item) => (
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
                  <button className="btn-buy">구매하기</button>
                  <button className="btn-detail">상세보기</button>
                </div>
              </div>
            </div>
          ))}

        {/* 내가 작성한 공구 */}
        {tab === "written" &&
          writtenList.map((item) => (
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

      {/* 페이지네이션 (임시) */}
      <Pagination className="paginationContainer">
        <PaginationItem><PaginationLink first href="#" /></PaginationItem>
        <PaginationItem><PaginationLink previous href="#" /></PaginationItem>
        {[1, 2, 3].map((num) => (
          <PaginationItem key={num}>
            <PaginationLink href="#">{num}</PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem><PaginationLink next href="#" /></PaginationItem>
        <PaginationItem><PaginationLink last href="#" /></PaginationItem>
      </Pagination>
    </>
  );
}
