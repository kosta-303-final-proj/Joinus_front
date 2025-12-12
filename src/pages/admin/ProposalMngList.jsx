import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { myAxios } from '../../config';
import Header from './Header';
import SearchFilter from './SearchFilter';
import './admin-common.css';
import './ProposalMngList.css';

const ProposalMngList = () => {
  const navigate = useNavigate();

  // 탭 상태: 백엔드와 통신할 값 (PENDING, REJECTED, ALL)
  const [activeTab, setActiveTab] = useState('PENDING');
  // 검색 필터: SearchFilter 컴포넌트에서 받은 값을 저장
  const [searchFilters, setSearchFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(0); // Spring Pageable은 0부터 시작

  // 백엔드에서 받아온 페이징 데이터를 저장할 상태
  const [proposalPage, setProposalPage] = useState({
    content: [], // 실제 제안 목록 (ProposalDto)
    totalPages: 0,
    totalElements: 0,
    number: 0,
  });

  // 제안 데이터 가져오기
  const fetchProposals = useCallback(async (page, tab, filters) => {
    try {
      // 백엔드 요청 파라미터를 동적으로 구성
      const params = {
        page: page,
        size: 10, // 페이지 사이즈 고정 (백엔드 @PageableDefault와 일치해야 함)
        status: tab === 'ALL' ? null : tab, //  '전체' 탭일 때는 status 파라미터를 null로 보냄
        searchType: filters.searchType,
        searchKeyword: filters.searchKeyword,
      };

      const response = await myAxios().get('/admin/proposalList', { params });
      setProposalPage(response.data);
      setCurrentPage(page);

    } catch (error) {
      console.error("제안 목록 조회 실패:", error);
      // alert("제안 목록을 불러오는 데 실패했습니다."); // 디버깅 시 주석 해제
    }
  }, []);

  // currentPage, activeTab, searchFilters가 변경될 때마다 재요청
  useEffect(() => {
    fetchProposals(currentPage, activeTab, searchFilters);
  }, [currentPage, activeTab, searchFilters, fetchProposals]);

  // 탭 변경
  const handleTabChange = (tabValue) => {
    // 탭이 변경되면 activeTab만 바꾸고, useEffect가 감지하여 fetchProposals 호출
    setActiveTab(tabValue);
    setCurrentPage(0); // 항상 0페이지로 돌아가서 재검색
  };

  // 검색
  const handleSearch = (filters) => {
    setSearchFilters(filters); // 검색 필터 상태 저장
    setCurrentPage(0); // 검색 시 0페이지로 돌아가서 재요청
  };

  //  페이지 변경
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 0 && pageNumber < proposalPage.totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleReset = () => {
    console.log('필터 초기화');
  };


  return (
    <div className="admin-layout">

      <div className="main-content">
        <Header title="제안 관리" />

        <div className="content-area">
          {/* 검색 필터 */}
          <SearchFilter
            variant="simple"
            onSearch={handleSearch}
            onReset={handleReset}
          />

          {/* 탭 */}
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
                {proposalPage.content.map((proposal) => (
                  <tr key={proposal.id}>
                    <td>{proposal.id}</td>
                    <td>{proposal.voteCount}</td>
                    <td
                      className="title-cell"
                      style={{ cursor: 'pointer' }}
                      //제안상세 완료시 이 부분 수정하기
                      onClick={() => navigate(`/admin/proposalDetailAdmin/${proposal.id}`)}
                    >
                      {proposal.productName}</td>
                    <td>{proposal.memberUsername}</td>
                    <td>{proposal.createdAt ? proposal.createdAt.substring(0, 10) : 'N/A'}</td>
                    <td>
                      <span className={`status-badge ${proposal.status === 'REJECTED' ? 'rejected' : 'pending'}`}>
                        {proposal.statusDescription}  {/* 한글로 표시됨 */}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 데이터가 없을 때 */}
          {proposalPage.content.length === 0 && (
            <div className="empty-state">
              <p>해당하는 제안이 없습니다.</p>
            </div>
          )}

          {/* 페이지네이션 */}
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
        </div>
      </div>
    </div>
  );
};

export default ProposalMngList;