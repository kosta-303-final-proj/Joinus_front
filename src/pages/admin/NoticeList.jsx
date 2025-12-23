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

  const [filters, setFilters] = useState({
    searchKeyword: ''
  });

  // 공지사항 데이터 가져오는 함수 (검색 및 페이징 파라미터 사용)
  const fetchNotices = useCallback(async (page = 0) => {
    try {
      // 1. 요청 파라미터 설정
      // Spring Boot의 Pageable에 맞게 page는 0부터 시작, size는 10으로 고정
      const params = {
        page: page,
        size: 10,
        searchKeyword: filters.searchKeyword || null
      };

      console.log('📤 요청 params:', params);

      // 2. API 호출
      const response = await myAxios().get('/admin/noticeList', { params });

      console.log('📥 응답:', response.data);

      // 3. 상태 업데이트
      setNoticePage(response.data);
      setCurrentPage(page);

    } catch (error) {
      console.error("공지사항 목록 조회 실패:", error);
      alert("공지사항 목록을 불러오는 데 실패했습니다.");
    }
  }, [filters]);

  //  컴포넌트 마운트 시 및 페이지 번호 변경 시 데이터 로드
  useEffect(() => {
    fetchNotices(currentPage);
  }, [currentPage, filters, fetchNotices]);

  // 검색 함수
 const handleSearch = (searchFilters) => {
    console.log('검색:', searchFilters);
    
    // 검색 필터 업데이트
    setFilters({
      searchKeyword: searchFilters.searchKeyword || ''
    });
    
    // 첫 페이지로 이동
    setCurrentPage(0);
  };

    // 초기화 함수
  const handleReset = () => {
    console.log('초기화');
    
    setFilters({
      searchKeyword: ''
    });
    
    setCurrentPage(0);
  };

  // 페이지 변경
  const handlePageChange = (pageNumber) => {
    // 백엔드는 0부터 시작하므로 pageNumber를 그대로 사용
    if (pageNumber >= 0 && pageNumber < noticePage.totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleEdit = (id) => {
    console.log('수정:', id);
    navigate(`/admin/noticeForm/${id}`);
  };

  const handleDelete = async (id) => {
  if (!window.confirm('이 공지사항을 삭제하시겠습니까?')) {
    return;
  }
  
  try {
    await myAxios().delete(`/admin/noticeDelete/${id}`);
    alert('삭제되었습니다.');
    
    // 현재 페이지 새로고침
    fetchNotices(currentPage);
    
  } catch (error) {
    console.error('삭제 실패:', error);
    alert('삭제에 실패했습니다.');
  }
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