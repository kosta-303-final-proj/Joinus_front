import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { myAxios } from '../../config';
import AdminHeader from '../../components/layout/AdminHeader';
import SearchFilter from './SearchFilter';
import '../../styles/components/button.css';
import '../../styles/components/table.css';
import './admin-common.css';

const NoticeList = () => {
  const navigate = useNavigate();

  const [noticePage, setNoticePage] = useState({
    content: [], // 실제 공지사항 목록
    totalPages: 0, // 전체 페이지 수
    totalElements: 0, // 전체 요소 수
    number: 0, // 현재 페이지 번호 (0부터 시작)
  });
  const [currentPage, setCurrentPage] = useState(0);

  // 공지사항 데이터 가져오는 함수 (검색 및 페이징 파라미터 사용)
  const fetchNotices = useCallback(async (page, filters = {}) => {
    try {
      // 1. 요청 파라미터 설정
      // Spring Boot의 Pageable에 맞게 page는 0부터 시작, size는 10으로 고정
      const params = {
        page: page,
        size: 10,
        // TODO: filters를 활용하여 title, content 검색어 추가 (예: title: filters.keyword)
      };

      // 2. API 호출
      const response = await myAxios().get('/admin/noticeList', { params });

      // 3. 상태 업데이트
      setNoticePage(response.data);
      setCurrentPage(page);

    } catch (error) {
      console.error("공지사항 목록 조회 실패:", error);
      alert("공지사항 목록을 불러오는 데 실패했습니다.");
    }
  }, []);

  //  컴포넌트 마운트 시 및 페이지 번호 변경 시 데이터 로드
  useEffect(() => {
    fetchNotices(currentPage);
  }, [currentPage, fetchNotices]);

  // 검색 함수
  const handleSearch = (filters) => {
    console.log('검색:', filters);
    // 검색 시 1페이지부터 다시 로드
    fetchNotices(0, filters);
  };

  // 페이지 변경
  const handlePageChange = (pageNumber) => {
    // 백엔드는 0부터 시작하므로 pageNumber를 그대로 사용
    if (pageNumber >= 0 && pageNumber < noticePage.totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleReset = () => {
    console.log('초기화');
  };

  const handleEdit = (id) => {
    console.log('수정:', id);
    navigate(`/admin/noticeForm/${id}`);
  };

  const handleDelete = (id) => {
    console.log('삭제:', id);
  };

  return (
    <div className="admin-layout">

      <div className="main-content">
        <AdminHeader title="공지사항" />

        <div className="content-area">
          {/* 검색 필터 */}
          <SearchFilter
            variant="simple"
            searchOptions={[
              { value: 'title', label: '제목' },
            ]}
            showResetButton={false}
            onSearch={handleSearch}
            onReset={handleReset}
          />

          {/* 테이블 */}
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>번호</th>
                  <th>제목</th>
                  <th>게시 날짜</th>
                  <th>작업</th>
                </tr>
              </thead>
              <tbody>
                {noticePage.content.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty-state">
                      <p>등록된 공지사항이 없습니다.</p>
                    </td>
                  </tr>
                ) : (
                  // ⭐️ notice.createdAt을 사용하여 게시 날짜 표시
                  noticePage.content.map((notice, index) => (
                    <tr key={notice.id}>
                      {/* DB 순서가 아닌 화면에 보이는 순번 (전체 요소 수 기반) */}
                      <td>{noticePage.totalElements - (noticePage.number * noticePage.size) - index}</td>
                      <td className="title-cell">{notice.title}</td>
                      <td>{notice.createdAt ? notice.createdAt.substring(0, 10) : 'N/A'}</td> {/* 날짜 포맷 */}
                      <td>
                        <button
                        className="admin-button primary small"
                        style={{ marginRight: '4px' }}
                          onClick={() => handleEdit(notice.id)}
                        >
                          수정
                        </button>
                        <button
                          className="admin-button secondary small"
                          onClick={() => handleDelete(notice.id)}
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 등록 버튼 */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end'
          }}>
            <button
              className="admin-button primary"
              onClick={() => navigate('/admin/noticeForm')}
            >
              공지사항 등록
            </button>
          </div>

          {/* 페이지네이션 */}
          <div className="pagination">
            {Array.from({ length: noticePage.totalPages }, (_, i) => (
              <button
                key={i}
                className={`page-btn ${i === currentPage ? 'active' : ''}`}
                onClick={() => handlePageChange(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeList;