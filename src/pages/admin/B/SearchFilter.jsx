// 사용법
// 1. simple
{/* <SearchFilter 
  variant="simple"
  onSearch={handleSearch}
/> */}
// 2. withDate
{/* <SearchFilter 
  variant="withDate"
  onSearch={handleSearch}
/> */}
// 3. withTabs (Ex. 교환/반품 관리 페이지)
{/* <SearchFilter 
  variant="withTabs"
  tabs={['교환신청', '교환승인', '교환완료', '교환거절']} <<필요한 만큼 기재하시면 됩니다!!
  secondTabs={['반품신청', '반품승인', '반품완료', '반품거절']}  <<필요한 만큼 기재하시면 됩니다!!
  onSearch={handleSearch}
  onReset={handleReset}
/> */}

import React, { useState } from 'react';
import { 
  Input, Button, Label,
  Nav, NavItem, NavLink 
} from 'reactstrap';
import './SearchFilter.css';

function SearchFilter({ 
  variant = 'simple',
  tabs = [],
  secondTabs = [],
  onSearch,
  onReset
}) {
  
  const [searchType, setSearchType] = useState('게시글 제목');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeTab, setActiveTab] = useState(tabs[0] || '');
  const [activeSecondTab, setActiveSecondTab] = useState(secondTabs[0] || '');
  
  const handleSearch = () => {
    if (onSearch) {
      onSearch({
        searchType,
        searchKeyword,
        startDate,
        endDate,
        tab: activeTab,
        secondTab: activeSecondTab
      });
    }
  };
  
  const handleReset = () => {
    setSearchType('게시글 제목');
    setSearchKeyword('');
    setStartDate('');
    setEndDate('');
    if (onReset) {
      onReset();
    }
  };
  
  return (
    <div className="search-filter-box">
      
       {/* 탭 (withTabs일 때만) */}
      {variant === 'withTabs' && tabs.length > 0 && (
        <>
          {/* 교환 탭 */}
          <div className="filter-section">
            <Label>교환</Label>
            <div className="pill-tabs">
              {tabs.map(tab => (
                <button
                  key={tab}
                  className={`pill-tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
          {/* 반품 탭 */}
          {secondTabs.length > 0 && (
            <div className="filter-section">
              <Label>반품</Label>
              <div className="pill-tabs">
                {secondTabs.map(tab => (
                  <button
                    key={tab}
                    className={`pill-tab ${activeSecondTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveSecondTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
      
      {/* 기간 선택 (withDate, withTabs일 때만) */}
      {(variant === 'withDate' || variant === 'withTabs') && (
        <div className="filter-section">
          <Label>기간</Label>
          <div className="date-range">
            <Input 
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span>~</span>
            <Input 
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      )}
      
      {/* 검색 (공통) */}
      <div className="filter-section">
        <Label>검색 분류</Label>
        <div className="search-row">
          <Input 
            type="select"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option>제목</option>
            <option>ID</option>
            <option>내용</option>
          </Input>
          
          <Input 
            type="text"
            placeholder="search"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
      </div>
      
      {/* 버튼 */}
      <div className="filter-buttons">
        <Button color="primary" className="search-btn" onClick={handleSearch}>
          검색
        </Button>
        <Button outline onClick={handleReset}>
          설정 초기화
        </Button>
      </div>
      
    </div>
  );
}

export default SearchFilter;