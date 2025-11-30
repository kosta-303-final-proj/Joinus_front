import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import SearchFilter from './SearchFilter';
import './admin-common.css';

const PageName = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  // 더미 데이터
  const notices = [
    {
      id: 1,
      title: '2024년 12월 정기 시스템 점검 안내',
      date: '2024-12-01'
    },
    {
      id: 2,
      title: '배송 지연 안내 (명절 기간)',
      date: '2024-11-28'
    },
    {
      id: 3,
      title: '공동구매 최저가 정책 변경 안내',
      date: '2024-11-25'
    },
    {
      id: 4,
      title: '회원 등급 혜택 업데이트',
      date: '2024-11-20'
    },
    {
      id: 5,
      title: '개인정보 처리방침 변경 안내',
      date: '2024-11-15'
    }
  ];

  const handleSearch = (filters) => {
    console.log('검색:', filters);
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
      <Sidebar />

      <div className="main-content">
        <Header title="공지사항" />

        <div className="content-area">
          {/* 검색 필터 */}
          <SearchFilter
            variant="simple"
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
                {notices.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty-state">
                      <p>등록된 공지사항이 없습니다.</p>
                    </td>
                  </tr>
                ) : (
                  notices.map((notice) => (
                    <tr key={notice.id}>
                      <td>{notice.id}</td>
                      <td className="title-cell">{notice.title}</td>
                      <td>{notice.date}</td>
                      <td>
                        <button
                          className="btn-secondary"
                          style={{ marginRight: '8px', padding: '6px 16px' }}
                          onClick={() => handleEdit(notice.id)}
                        >
                          수정
                        </button>
                        <button
                          className="btn-secondary"
                          style={{ padding: '6px 16px' }}
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
            justifyContent: 'flex-end'}}>
            <button
              className="btn-primary"
              onClick={() => navigate('/admin/noticeForm')}
            >
              공지사항 등록
            </button>
          </div>

          {/* 페이지네이션 */}
          <div className="pagination">
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
          </div>



        </div>
      </div>
    </div>
  );
};

export default PageName;