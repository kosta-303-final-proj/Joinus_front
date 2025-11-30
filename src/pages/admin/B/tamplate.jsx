// 복붙 템플릿 

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import SearchFilter from './SearchFilter';

const PageName = () => {
  const [activeTab, setActiveTab] = useState('탭1');
  const [currentPage, setCurrentPage] = useState(1);

  // 더미 데이터
  const data = [];

  const handleSearch = (filters) => {
    console.log('검색:', filters);
  };

  const handleReset = () => {
    console.log('초기화');
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      
      <div className="main-content">
        <Header title="페이지 제목" />
        
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
                className={`tab ${activeTab === '탭1' ? 'active' : ''}`}
                onClick={() => setActiveTab('탭1')}
              >
                탭1
              </button>
              <button 
                className={`tab ${activeTab === '탭2' ? 'active' : ''}`}
                onClick={() => setActiveTab('탭2')}
              >
                탭2
              </button>
            </div>
          </div>

          {/* 테이블 */}
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>컬럼1</th>
                  <th>컬럼2</th>
                  <th>컬럼3</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>데이터1</td>
                  <td>데이터2</td>
                  <td>
                    <span className="status-badge blue">상태</span>
                  </td>
                </tr>
              </tbody>
            </table>
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