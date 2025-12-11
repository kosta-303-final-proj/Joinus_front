// ========================================
// 사용법
// ========================================

// 1. simple (기본 옵션 사용, 초기화 버튼 없음)
{/* <SearchFilter 
  variant="simple"
  onSearch={handleSearch}
/> */}

// 2. simple (커스텀 옵션, 초기화 버튼 있음)
{/* <SearchFilter 
  variant="simple"
  searchOptions={[
    { value: 'question', label: '문의 내용' },
    { value: 'memberUsername', label: '작성자' }
  ]}
  showResetButton={true}  // 
  onSearch={handleSearch}
  onReset={handleReset}
/> */}

// 3. withDate (기간 검색 포함, 초기화 버튼 필수)
{/* <SearchFilter 
  variant="withDate"
  searchOptions={[
    { value: 'orderId', label: '주문번호' },
    { value: 'memberName', label: '구매자명' }
  ]}
  showResetButton={true}  //
  onSearch={handleSearch}
  onReset={handleReset}
/> */}

// 4. withTabs (탭 포함, 초기화 버튼 필수)
{/* <SearchFilter 
  variant="withTabs"
  tabs={['교환신청', '교환승인', '교환완료', '교환거절']}
  secondTabs={['반품신청', '반품승인', '반품완료', '반품거절']}
  searchOptions={[
    { value: 'orderId', label: '주문번호' },
    { value: 'productName', label: '상품명' }
  ]}
  showResetButton={true}  // 
  onSearch={handleSearch}
  onReset={handleReset}
/> */}

import React, { useState } from 'react';
import { 
  Input, Button, Label 
} from 'reactstrap';
import './SearchFilter.css';

function SearchFilter({ 
  variant = 'simple',
  tabs = [],
  secondTabs = [],
  searchOptions = [ 
    { value: 'title', label: '제목' },
    { value: 'id', label: 'ID' },
    { value: 'content', label: '내용' }
  ],
  showResetButton = false,  // ✅ 초기화 버튼 표시 여부
  onSearch,
  onReset
}) {
  
  const [searchType, setSearchType] = useState(searchOptions[0]?.value || '');
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
    setSearchType(searchOptions[0]?.value || '');
    setSearchKeyword('');
    setStartDate('');
    setEndDate('');
    if (onReset) {
      onReset();
    }
  };
  
  return (
    <div className="admin-search-filter-box">
      
       {/* 탭 (withTabs일 때만) */}
      {variant === 'withTabs' && tabs.length > 0 && (
        <>
          {/* 교환 탭 */}
          <div className="admin-search-filter-section">
            <Label>교환</Label>
            <div className="admin-search-filter-pill-tabs">
              {tabs.map(tab => (
                <button
                  key={tab}
                  className={`admin-search-filter-pill-tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
          {/* 반품 탭 */}
          {secondTabs.length > 0 && (
            <div className="admin-search-filter-section">
              <Label>반품</Label>
              <div className="admin-search-filter-pill-tabs">
                {secondTabs.map(tab => (
                  <button
                    key={tab}
                    className={`admin-search-filter-pill-tab ${activeSecondTab === tab ? 'active' : ''}`}
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
        <div className="admin-search-filter-section">
          <Label>기간</Label>
          <div className="admin-search-filter-date-range">
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
      <div className="admin-search-filter-section">
        <Label>검색 분류</Label>
        <div className="admin-search-filter-search-row">
          <Input 
            type="select"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            {searchOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
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
      <div className="admin-search-filter-buttons">
        <Button 
          color="primary" 
          className="admin-search-filter-search-btn" 
          onClick={handleSearch}
        >
          검색
        </Button>
        
        {/* 초기화 버튼 (조건부 렌더링) */}
        {showResetButton && (
          <Button outline onClick={handleReset}>
            설정 초기화
          </Button>
        )}
      </div>
      
    </div>
  );
}

export default SearchFilter;