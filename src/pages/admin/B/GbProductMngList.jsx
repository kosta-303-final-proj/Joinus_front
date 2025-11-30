import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Sidebar from './Sidebar';
import Header from './Header';
import SearchFilter from './SearchFilter';
import NotificationModal from './NotificationModal';
import GbProductCreate from './GbProductCreate';
import './admin-common.css';
import './GbProductMngList.css';

export default function GbProductMngList() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('진행중');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('시작날짜-최신순');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // 임시 데이터
  const gbProducts = [
    {
      id: 1,
      participants: 44,
      minParticipants: 10,
      status: '진행중',
      code: '12343',
      name: '영국 한정 출시 10주년 기념 마우스패드',
      price: 12800,
      totalPrice: 563200,
      startDate: '2025-11-06',
      endDate: '2025-11-10'
    },
    {
      id: 2,
      participants: 8,
      minParticipants: 10,
      status: '진행중',
      code: '12344',
      name: 'iHerb 비타민C 1000mg',
      price: 15000,
      totalPrice: 120000,
      startDate: '2025-11-05',
      endDate: '2025-11-12'
    },
    {
      id: 3,
      participants: 5,
      minParticipants: 10,
      status: '미게시',
      code: '12345',
      name: '타오바오 무선 이어폰',
      price: 25000,
      totalPrice: 125000,
      startDate: '2025-11-08',
      endDate: '2025-11-15'
    }
  ];

  const getFilteredProducts = () => {
    if (activeTab === '전체') return gbProducts;
    return gbProducts.filter(p => p.status === activeTab);
  };

  //정렬
  const getSortedProducts = (products) => {
    const sorted = [...products];

    switch (sortBy) {
      case '시작날짜-최신순':
        return sorted.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
      case '시작날짜-오래된순':
        return sorted.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
      case '종료날짜-최신순':
        return sorted.sort((a, b) => new Date(b.endDate) - new Date(a.endDate));
      case '종료날짜-오래된순':
        return sorted.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
      case '가격-높은순':
        return sorted.sort((a, b) => b.price - a.price);
      case '가격-낮은순':
        return sorted.sort((a, b) => a.price - b.price);
      case '참여인원-많은순':
        return sorted.sort((a, b) => b.participants - a.participants);
      case '참여인원-적은순':
        return sorted.sort((a, b) => a.participants - b.participants);
      default:
        return sorted;
    }
  };

  const filteredProducts = getSortedProducts(getFilteredProducts());

  // 체크박스 전체 선택/해제
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(filteredProducts.map(p => p.id));
    } else {
      setSelectedItems([]);
    }
  };

  // 개별 체크박스
  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // 새 창 열기
  const handleOpenCreateWindow = () => {
    // 새 창 열기 (너비 1200px, 높이 900px, 스크롤 가능)
    window.open(
      '/admin/gbProductCreate',
      'gbProductCreate',
      'width=1200,height=900,scrollbars=yes,resizable=yes'
    );
  };

  useEffect(() => {
  const handleMessage = (event) => {
    if (event.data.type === 'GB_PRODUCT_CREATED') {
      console.log('새 공구 등록됨:', event.data.data);
    }
  };

  window.addEventListener('message', handleMessage);
  return () => window.removeEventListener('message', handleMessage);
}, []);

  // 알림 발송
  const handleNotification = () => {
    if (selectedItems.length === 0) {
      alert('알림을 발송할 공구를 선택해주세요.');
      return;
    }
    setShowNotificationModal(true);
  };

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
        <Header title="공동 구매 상품 관리" />

        <div className="content-area">
          {/* 검색 필터 */}
          <SearchFilter
            variant="withDate"
            onSearch={handleSearch}
            onReset={handleReset}
          />

          {/* 탭 */}
          <div className="tabs-container">
            <div className="tabs">
              <button
                className={`tab ${activeTab === '진행중' ? 'active' : ''}`}
                onClick={() => setActiveTab('진행중')}
              >
                진행중
              </button>
              <button
                className={`tab ${activeTab === '미게시' ? 'active' : ''}`}
                onClick={() => setActiveTab('미게시')}
              >
                미게시
              </button>
              <button
                className={`tab ${activeTab === '결제대기' ? 'active' : ''}`}
                onClick={() => setActiveTab('결제대기')}
              >
                결제대기
              </button>
              <button
                className={`tab ${activeTab === '완료된 공구' ? 'active' : ''}`}
                onClick={() => setActiveTab('완료된 공구')}
              >
                완료된 공구
              </button>
              <button
                className={`tab ${activeTab === '취소된 공구' ? 'active' : ''}`}
                onClick={() => setActiveTab('취소된 공구')}
              >
                취소된 공구
              </button>
              <button
                className={`tab ${activeTab === '전체' ? 'active' : ''}`}
                onClick={() => setActiveTab('전체')}
              >
                전체
              </button>
            </div>

            <div className="sort-dropdown">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="시작날짜-최신순">시작날짜 최신순</option>
                <option value="시작날짜-오래된순">시작날짜 오래된순</option>
                <option value="종료날짜-최신순">종료날짜 최신순</option>
                <option value="종료날짜-오래된순">종료날짜 오래된순</option>
                <option value="가격-높은순">가격 높은순</option>
                <option value="가격-낮은순">가격 낮은순</option>
                <option value="참여인원-많은순">참여인원 많은순</option>
                <option value="참여인원-적은순">참여인원 적은순</option>
              </select>
            </div>
          </div>



          {/* 테이블 */}
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedItems.length === filteredProducts.length && filteredProducts.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>현재 인원</th>
                  <th>상태</th>
                  <th>공구 코드</th>
                  <th>공구명</th>
                  <th>가격</th>
                  <th>총 가격</th>
                  <th>시작 날짜</th>
                  <th>종료 날짜</th>
                  <th>작업</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(product.id)}
                        onChange={() => handleSelectItem(product.id)}
                      />
                    </td>
                    <td>{product.participants}</td>
                    <td>
                      <span className={`status-badge ${product.status === '진행중' ? 'blue' :
                        product.status === '미게시' ? 'gray' :
                          'green'
                        }`}>
                        {product.status}
                      </span>
                    </td>
                    <td>{product.code}</td>
                    <td className="title-cell">{product.name}</td>
                    <td>{product.price.toLocaleString()}원</td>
                    <td>{product.totalPrice.toLocaleString()}원</td>
                    <td>{product.startDate}</td>
                    <td>{product.endDate}</td>
                    <td>
                      <button className="action-btn">수정</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 데이터가 없을 때 */}
          {filteredProducts.length === 0 && (
            <div className="empty-state">
              <p>해당하는 공동 구매 상품이 없습니다.</p>
            </div>
          )}

          {/* 하단 버튼 영역 */}
          <div className="bottom-actions">
            <button
              className="btn-secondary notification-btn"
              onClick={handleNotification}
            >
              알림 발송
            </button>
            <button
              className="btn-primary create-btn"
              onClick={handleOpenCreateWindow}
            >
              새 공구 등록
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

      {showNotificationModal && (
        <NotificationModal
          selectedProducts={gbProducts.filter(p => selectedItems.includes(p.id))}
          onClose={() => setShowNotificationModal(false)}
          onSend={(data) => {
            console.log('알림 발송:', data);
            setShowNotificationModal(false);
            setSelectedItems([]);
          }}
        />
      )}





    </div>
  );
};