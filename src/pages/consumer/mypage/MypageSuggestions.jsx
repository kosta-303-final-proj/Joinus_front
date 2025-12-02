import React, { useState } from "react";
import "./MypageSuggestions.css";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

export default function MypageSuggestions() {
  const [tab, setTab] = useState("participated");

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

      {/* ================= 탭별 데이터 ================= */}
      <div className="suggestions-group-list">

        {/* 참여중인 공구 */}
        {tab === "participated" && (
          <>
            {/* 1 */}
            <div className="suggestions-card">
              <div className="card-img">이미지</div>

              <div className="card-info">
                <div>
                  <div className="category">전자기기</div>
                  <div className="title">프리미엄 무선 이어폰</div>
                  <div className="desc">고음질 무선 이어폰 제안 내용 20자.</div>
                  <div className="votes">참여 투표 인원수: 50명</div>
                </div>

                <div className="card-actions">
                  <button className="btn-buy">구매하기</button>
                  <button className="btn-detail">상세보기</button>
                </div>
              </div>
            </div>

            {/* 2 */}
            <div className="suggestions-card">
              <div className="card-img">이미지</div>

              <div className="card-info">
                <div>
                  <div className="category">홈앤리빙</div>
                  <div className="title">스마트 홈 조명</div>
                  <div className="desc">
                    자동 밝기 조절 가능한 스마트 조명 제안 내용.
                  </div>
                  <div className="votes">참여 투표 인원수: 23명</div>
                </div>

                <div className="card-actions">
                  <button className="btn-detail">상세보기</button>
                </div>
              </div>
            </div>

            {/* 3 */}
            <div className="suggestions-card">
              <div className="card-img">이미지</div>

              <div className="card-info">
                <div>
                  <div className="category">패션</div>
                  <div className="title">겨울용 발열 조끼</div>
                  <div className="desc">초경량 발열 조끼 제안된 공구 설명.</div>
                  <div className="votes">참여 투표 인원수: 41명</div>
                </div>

                <div className="card-actions">
                  <button className="btn-buy">구매하기</button>
                  <button className="btn-detail">상세보기</button>
                </div>
              </div>
            </div>

            {/* 4 */}
            <div className="suggestions-card">
              <div className="card-img">이미지</div>

              <div className="card-info">
                <div>
                  <div className="category">식품</div>
                  <div className="title">견과류 5종 프리미엄 팩</div>
                  <div className="desc">영양가 높은 견과 공구 제안.</div>
                  <div className="votes">참여 투표 인원수: 12명</div>
                </div>

                <div className="card-actions">
                  <button className="btn-detail">상세보기</button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* 내가 작성한 공구 */}
        {tab === "written" && (
          <>
            {/* 1 */}
            <div className="suggestions-card">
              <div className="card-img">이미지</div>

              <div className="card-info">
                <div>
                  <div className="category">패션</div>
                  <div className="title">내가 올린 겨울 패딩 공구</div>
                  <div className="desc">직접 올린 패딩 공구 제안.</div>
                  <div className="votes">참여 투표 인원수: 11명</div>
                </div>

                <div className="card-actions">
                  <button className="btn-detail">상세보기</button>
                </div>
              </div>
            </div>

            {/* 2 */}
            <div className="suggestions-card">
              <div className="card-img">이미지</div>

              <div className="card-info">
                <div>
                  <div className="category">식품</div>
                  <div className="title">내가 올린 견과 공구</div>
                  <div className="desc">프리미엄 견과 세트 공구 제안.</div>
                  <div className="votes">참여 투표 인원수: 7명</div>
                </div>

                <div className="card-actions">
                  <button className="btn-buy">구매하기</button>
                  <button className="btn-detail">상세보기</button>
                </div>
              </div>
            </div>

            {/* 3 */}
            <div className="suggestions-card">
              <div className="card-img">이미지</div>

              <div className="card-info">
                <div>
                  <div className="category">뷰티</div>
                  <div className="title">내가 올린 스킨케어 세트</div>
                  <div className="desc">피부 진정 스킨케어 공구 제안.</div>
                  <div className="votes">참여 투표 인원수: 19명</div>
                </div>

                <div className="card-actions">
                  <button className="btn-buy">구매하기</button>
                  <button className="btn-detail">상세보기</button>
                </div>
              </div>
            </div>

            {/* 4 */}
            <div className="suggestions-card">
              <div className="card-img">이미지</div>

              <div className="card-info">
                <div>
                  <div className="category">반려동물</div>
                  <div className="title">고양이 사료 대용량 공구</div>
                  <div className="desc">대용량 사료 구매 공구 제안.</div>
                  <div className="votes">참여 투표 인원수: 8명</div>
                </div>

                <div className="card-actions">
                  <button className="btn-detail">상세보기</button>
                </div>
              </div>
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
    </>
  );
}
