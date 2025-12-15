import React, { useEffect, useState } from "react";
import "./MypageAlert.css";
import axios from "axios";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

export default function MypageAlert() {
  const [alertList, setAlertList] = useState([]);
  const [openedIds, setOpenedIds] = useState([]);
  const [readUiIds, setReadUiIds] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 로그인 유저 정보
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const username = userInfo?.username;

  // 알림 리스트 조회
  const getAlertList = () => {
    if (!username) return;
    axios
      .get(`http://localhost:8080/mypage/alert?username=${username}`)
      .then((res) => setAlertList(res.data))
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
                        {alert.createdAt}
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

      <div className="alert-info-box">
        <div className="alert-info-title">안내사항</div>
        • 알림은 30일 보관 후 자동 삭제됩니다.
        <br />
        • 삭제된 알림은 복구할 수 없습니다.
      </div>
    </>
  );
}
