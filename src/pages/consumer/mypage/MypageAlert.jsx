import React, { useEffect, useState } from "react";
import "./MypageAlert.css";
import axios from "axios";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { useNavigate } from "react-router-dom";

export default function MypageAlert() {
  const navigate = useNavigate();

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return dateStr.substring(0, 10); // YYYY-MM-DD
};


  const [alertList, setAlertList] = useState([]);
  const [openedIds, setOpenedIds] = useState([]);
  const [readUiIds, setReadUiIds] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 로그인 유저 정보
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  const username = userInfo?.username;

  // 알림 리스트 조회
  const getAlertList = () => {
    if (!username) return;
    axios
      .get(`http://localhost:8080/mypage/alert?username=${username}`)
.then((res) => {
      // 최신순(createdAt 내림차순) 정렬 추가
     const sortedData = (res.data || []).sort((a, b) => {
  const aUnread = !a.readedAt;
  const bUnread = !b.readedAt;

  // 1️⃣ 안읽은 게 위
  if (aUnread && !bUnread) return -1;
  if (!aUnread && bUnread) return 1;

  // 2️⃣ 같은 그룹 안에서는 최신순
  return new Date(b.createdAt) - new Date(a.createdAt);
});
      setAlertList(sortedData);
    })
    .catch((err) => console.log(err));
};

  useEffect(() => {
    getAlertList();
  }, [username]);

  useEffect(() => {
    setCurrentPage(1);
  }, [username]);

  // 페이징 계산
  const totalPages = Math.ceil(alertList.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = alertList.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [alertList]);

  // 읽지 않은 알림 수
  const unreadCount = alertList.filter(
    (a) => !a.readedAt && !readUiIds.includes(a.id)
  ).length;

  // ⭐ 아코디언 토글 + 읽음 처리
  const toggle = (id, readedAt) => {
    if (openedIds.includes(id)) {
      setOpenedIds(openedIds.filter((item) => item !== id));
    } else {
      // 🔥 처음 읽는 경우에만 서버에 읽음 처리 요청
      if (!readedAt && !readUiIds.includes(id)) {
        axios
          .put(`http://localhost:8080/mypage/alert/read?id=${id}`)
          .catch((err) => console.error(err));

        setReadUiIds([...readUiIds, id]);
      }

      setOpenedIds([...openedIds, id]);
    }
  };

  // 삭제
  const deleteAlert = (id) => {
    if (!window.confirm("이 알림을 삭제하시겠습니까?")) return;

    axios
      .delete(`http://localhost:8080/mypage/alert/delete?id=${id}`)
      .then(() => {
        setAlertList(alertList.filter((alert) => alert.id !== id));
        setOpenedIds(openedIds.filter((item) => item !== id));
        setReadUiIds(readUiIds.filter((item) => item !== id));
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <h1 className="alert-title-main">알림</h1>

      <p className="alert-count">
        읽지 않은 알림이{" "}
        <strong className="alert-blue">{unreadCount}개</strong> 있습니다.
      </p>

      <div className="alert-list">
        {currentItems.length === 0 ? (
          <div style={{ padding: "20px", color: "#777" }}>
            알림이 없습니다.
          </div>
        ) : (
          currentItems.map((alert) => {
            const isOpen = openedIds.includes(alert.id);
            const showNew = !alert.readedAt && !readUiIds.includes(alert.id);

            return (
              <div
                key={alert.id}
                className={`alert-accordion-item ${
                  showNew ? "alert-unread" : ""
                }`}
              >
                <div
                  className="alert-accordion-header"
                  onClick={() => toggle(alert.id, alert.readedAt)}
                >
                  <div className="alert-left">
                    <div className="alert-icon">✉</div>
                    <div>
                      <div className="alert-title">
                        {alert.title}
                        {showNew && (
                          <span className="alert-badge-new">NEW</span>
                        )}
                      </div>
                      <div className="alert-date">
                        {formatDate(alert.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className="alert-arrow">
                    {isOpen ? "▲" : "▼"}
                  </div>
                </div>

                {isOpen && (
  <div className="alert-accordion-body">
    <div className="alert-text">{alert.content}</div>

    {/* ✅ 이동 가능한 알림일 때만 */}
    {(alert.proposalId || alert.gbProductId) && (
     <div
  className="alert-link"
  onClick={() => {
    // 🔥 제안 승인/반려/수정 관련 알림은 무조건 제안 상세
    if (alert.proposalId && alert.title.includes("제안")) {
      navigate(`/proposalDetail/${alert.proposalId}`);
      return;
    }

    // 🔥 공구 관련 알림만 공구 상세
    if (alert.gbProductId) {
      navigate(`/gbProductDetail/${alert.gbProductId}`);
      return;
    }
  }}
>
  바로가기 &gt;
</div>
    )}

    <button
      className="alert-btn-delete alert-delete-bottom"
      onClick={() => deleteAlert(alert.id)}
    >
      삭제
    </button>
  </div>
)}
              </div>
            );
          })
        )}
      </div>

      {/* 페이지네이션 */}
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

      <div className="alert-info-box">
        <div className="alert-info-title">안내사항</div>
        <br />
        삭제된 알림은 복구할 수 없습니다.
      </div>
    </>
  );
}
