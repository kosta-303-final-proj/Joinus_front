import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import SearchFilter from './SearchFilter';
import './admin-common.css';
import './ProposalMngList.css';

const ProposalMngList = () => {
  const [activeTab, setActiveTab] = useState('검토대기');
  const [currentPage, setCurrentPage] = useState(1);

  const proposals = [
    {
      id: 123,
      votes: 56,
      title: '이 헤드셋 어때요???',
      author: 'gildongH123',
      date: '2025-11-12',
      status: '검토중'
    },
    {
      id: 432,
      votes: 40,
      title: '영국에만 발매된 마우스패드인데 너무 예뻐...',
      author: 'gildongH123',
      date: '2025-11-12',
      status: '검토중'
    },
    {
      id: 90,
      votes: 27,
      title: '이 옷 타오바오에서 2배로 싸게 팔...',
      author: 'morahae123',
      date: '2025-11-12',
      status: '검토중'
    },
    {
      id: 42,
      votes: 23,
      title: 'amzon에서 본 적축식 키보드인데...',
      author: 'morahae123',
      date: '2025-11-12',
      status: '반려'
    },
    {
      id: 210,
      votes: 23,
      title: '인형 공구해요~',
      author: 'gildongH123',
      date: '2025-11-12',
      status: '검토중'
    }
  ];

const filteredProposals = activeTab === '전체' 
  ? proposals 
  : proposals.filter(p => 
      activeTab === '검토대기' ? p.status === '검토중' : p.status === '반려'
    );

  //  const getFilteredProposals = () => {
  //   if (activeTab === '전체') {
  //     return proposals;
  //   } else if (activeTab === '검토대기') {
  //     return proposals.filter(p => p.status === '검토중');
  //   } else if (activeTab === '반려') {
  //     return proposals.filter(p => p.status === '반려');
  //   }
  //   return proposals;
  // };

  // const filteredProposals = getFilteredProposals();

  const handleSearch = (filters) => {
    console.log('검색:', filters);
  };

  const handleReset = () => {
    console.log('필터 초기화');
  };

  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="main-content">
        <Header title="제안 관리" />

        <div className="content-area">
          {/* 검색 필터 */}
          <SearchFilter
            variant="simple"
            onSearch={(filters) => {
              console.log(filters);
              // { searchType: "게시글 제목", searchKeyword: "비타민" }
            }}
          />

          {/* 탭 */}
          <div className="tabs-container">
            <div className="tabs">
              <button
                className={`tab ${activeTab === '검토대기' ? 'active' : ''}`}
                onClick={() => setActiveTab('검토대기')}
              >
                검토 대기
              </button>
              <button
                className={`tab ${activeTab === '반려' ? 'active' : ''}`}
                onClick={() => setActiveTab('반려')}
              >
                반려
              </button>
              <button
                className={`tab ${activeTab === '전체' ? 'active' : ''}`}
                onClick={() => setActiveTab('전체')}
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
                {filteredProposals.map((proposal) => (
                  <tr key={proposal.id}>
                    <td>{proposal.id}</td>
                    <td>{proposal.votes}</td>
                    <td className="title-cell">{proposal.title}</td>
                    <td>{proposal.author}</td>
                    <td>{proposal.date}</td>
                    <td>
                      <span className={`status-badge ${proposal.status === '반려' ? 'rejected' : 'pending'}`}>
                        {proposal.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 데이터가 없을 때 */}
          {filteredProposals.length === 0 && (
            <div className="empty-state">
              <p>해당하는 제안이 없습니다.</p>
            </div>
          )}

          {/* 페이지네이션 */}
          <div className="pagination">
            <button className="page-btn">1</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalMngList;