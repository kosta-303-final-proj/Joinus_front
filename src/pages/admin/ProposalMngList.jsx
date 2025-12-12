import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { myAxios } from '../../config';
import AdminHeader from '../../components/layout/AdminHeader';
import SearchFilter from './SearchFilter';
import './admin-common.css';
import './ProposalMngList.css';

const ProposalMngList = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('PENDING');
  const [sortType, setSortType] = useState('latest');  
  const [searchFilters, setSearchFilters] = useState({
    searchType: 'title',
    searchKeyword: ''
  });
  const [currentPage, setCurrentPage] = useState(0);

  const [proposalPage, setProposalPage] = useState({
    content: [],
    totalPages: 0,
    totalElements: 0,
    number: 0,
  });

  // ========================================
  // 제안 데이터 가져오기
  // ========================================
  const fetchProposals = async (page, tab, filters, sort) => {
    try {
      const params = {
        page: page,
        size: 10,
        status: tab === 'ALL' ? null : tab,
        searchType: filters.searchType,
        searchKeyword: filters.searchKeyword,
        sortType: sort  
      };

      const response = await myAxios().get('/admin/proposalList', { params });
      setProposalPage(response.data);
      setCurrentPage(page);

    } catch (error) {
      console.error("제안 목록 조회 실패:", error);
    }
  };

  // ========================================
  // 의존성 변경 시 재요청
  // ========================================
  useEffect(() => {
    fetchProposals(currentPage, activeTab, searchFilters, sortType);
  }, [currentPage, activeTab, searchFilters, sortType]);  

  // ========================================
  // 탭 변경
  // ========================================
  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
    setCurrentPage(0);
  };

  // ========================================
  // 검색
  // ========================================
  const handleSearch = (filters) => {
    setSearchFilters(filters);
    setCurrentPage(0);
  };

  // ========================================
  // 초기화
  // ========================================
  const handleReset = () => {
    setSearchFilters({
      searchType: 'title',
      searchKeyword: ''
    });
    setSortType('latest'); 
    setCurrentPage(0);
  };

  // ========================================
  // 페이지 변경
  // ========================================
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 0 && pageNumber < proposalPage.totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // ========================================
  // 정렬 변경 
  // ========================================
  const handleSortChange = (e) => {
    setSortType(e.target.value);
    setCurrentPage(0);
  };

  return (
    <div className="admin-layout">
      <div className="main-content">
        <AdminHeader title="제안 관리" />

        <div className="content-area">
          {/* 검색 필터 */}
          <SearchFilter
            variant="simple"
            searchOptions={[
              { value: 'memberUsername', label: '작성자' },
              { value: 'title', label: '제목' },
              { value: 'description', label: '내용' } 
            ]}
            onSearch={handleSearch}
            onReset={handleReset}
          />

          {/* 탭 + 정렬  */}
          <div className="tabs-container">
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'PENDING' ? 'active' : ''}`}
                onClick={() => handleTabChange('PENDING')}
              >
                검토 대기
              </button>
              <button
                className={`tab ${activeTab === 'REJECTED' ? 'active' : ''}`}
                onClick={() => handleTabChange('REJECTED')}
              >
                반려
              </button>
              <button
                className={`tab ${activeTab === 'ALL' ? 'active' : ''}`}
                onClick={() => handleTabChange('ALL')}
              >
                전체
              </button>
            </div>

            {/* 정렬 드롭다운 ! */}
            <div className="sort-dropdown">
              <select 
                value={sortType} 
                onChange={handleSortChange}
                className="sort-select"
              >
                <option value="latest">최신순</option>
                <option value="voteCount">투표순</option>
              </select>
            </div>
          </div>

          {/* 테이블 */}
          <div className="table-container">
            <table className="proposal-table">
              <thead>
                <tr>
                  <th>게시글 번호</th>
                  <th>투표 수</th>
                  <th>게시글 제목</th>
                  <th>작성자 ID</th>
                  <th>제안 날짜</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {proposalPage.content.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      <p>해당하는 제안이 없습니다.</p>
                    </td>
                  </tr>
                ) : (
                  proposalPage.content.map((proposal) => (
                    <tr key={proposal.id}>
                      <td>{proposal.id}</td>
                      <td>{proposal.voteCount}</td>
                      <td
                        className="title-cell"
                        style={{ cursor: 'pointer' }}
                        // onClick={() => navigate(`/admin/proposalDetail/${proposal.id}`)}
                      >
                        {proposal.productName}
                      </td>
                      <td>{proposal.memberUsername}</td>
                      <td>{proposal.createdAt ? proposal.createdAt.substring(0, 10) : 'N/A'}</td>
                      <td>
                        <span className={`status-badge ${
                          proposal.status === 'REJECTED' ? 'rejected' : 'pending'
                        }`}>
                          {proposal.statusDescription}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          {proposalPage.totalPages > 0 && (
            <div className="pagination">
              {Array.from({ length: proposalPage.totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`page-btn ${i === currentPage ? 'active' : ''}`}
                  onClick={() => handlePageChange(i)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProposalMngList;