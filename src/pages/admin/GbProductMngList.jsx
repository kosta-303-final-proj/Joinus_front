import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { myAxios } from '../../config';
import Header from './Header';
import SearchFilter from './SearchFilter';
import ParticipantsModal from './ParticipantsModal';
import NotificationModal from './NotificationModal';
import '../../styles/components/button.css';
import '../../styles/components/table.css';
import './admin-common.css';
import './GbProductMngList.css';

export default function GbProductMngList() {
  const navigate = useNavigate();

  // activeTab: Enum Code 사용
  const [activeTab, setActiveTab] = useState('ONGOING');
  const [sortBy, setSortBy] = useState('시작날짜-최신순');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  // 실제 데이터 State
  const [gbProducts, setGbProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // 검색 필터 State
  const [filters, setFilters] = useState({
    keyword: '',
    startDate: '',
    endDate: ''
  });

  // 페이지네이션 State
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0
  });

  //  데이터 불러오기
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const params = {
        status: activeTab === '전체' ? null : activeTab,
        keyword: filters.keyword || null,
        page: pagination.page,
        size: pagination.size,
        sort: getSortParam(sortBy)
      };

      const response = await myAxios().get('/admin/gbProductList', { params });

      // Page 응답 처리
      setGbProducts(response.data.content);
      setPagination({
        page: response.data.number,
        size: response.data.size,
        totalPages: response.data.totalPages,
        totalElements: response.data.totalElements
      });

    } catch (error) {
      console.error('목록 조회 오류:', error);
      alert('목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 정렬 파라미터 변환
  const getSortParam = (sortBy) => {
    const sortMap = {
      '시작날짜-최신순': 'startDate,desc',
      '시작날짜-오래된순': 'startDate,asc',
      '종료날짜-최신순': 'endDate,desc',
      '종료날짜-오래된순': 'endDate,asc',
      '가격-높은순': 'price,desc',
      '가격-낮은순': 'price,asc',
      '참여인원-많은순': 'participants,desc',
      '참여인원-적은순': 'participants,asc'
    };
    return sortMap[sortBy] || 'startDate,desc';
  };

  // 페이지 변경
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // 상태 한글 변환....필요없긴 한데...
  const getStatusLabel = (status) => {
    const statusMap = {
      'DRAFT': '미게시',
      'ONGOING': '진행중',
      'PENDING_ORDER': '구매대기',
      'ORDERED': '구매완료',
      'ARRIVED': '국내 도착',
      'COMPLETED': '완료',
      'CANCELED': '취소'
    };
    return statusMap[status] || status;
  };

  // 탭/페이지/정렬 변경 시 데이터 새로고침
  useEffect(() => {
    fetchProducts();
  }, [activeTab, pagination.page, sortBy]);

  // 참여인원 모달
  const handleViewParticipants = (productId) => {
    setSelectedProductId(productId);
    setShowParticipantsModal(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setShowParticipantsModal(false);
    setSelectedProductId(null);
  };

  // 검색
  const handleSearch = (searchFilters) => {
    setFilters(searchFilters);
    setPagination(prev => ({ ...prev, page: 0 }));  // 첫 페이지로
    fetchProducts();
  };

  // 초기화
  const handleReset = () => {
    setFilters({
      keyword: '',
      startDate: '',
      endDate: ''
    });
    setPagination(prev => ({ ...prev, page: 0 }));
    fetchProducts();
  };

  // 체크박스 전체 선택/해제
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(gbProducts.map(p => p.id));
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
    window.open(
      '/admin/gbProductCreate',
      'gbProductCreate',
      'width=1200,height=900,scrollbars=yes,resizable=yes'
    );
  };

  // 공구 수정 새 창
  const handleEdit = (productId) => {
    window.open(
      `/admin/gbProductCreate?id=${productId}`,
      'gbProductEdit',
      'width=1200,height=900,scrollbars=yes,resizable=yes'
    );
  };

  // 공구 등록 완료 시 목록 새로고침
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'GB_PRODUCT_CREATED') {
        console.log('새 공구 등록됨:', event.data.productId);
        fetchProducts();  // 새로고침!
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

  return (
    <div className="admin-layout">
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
                className={`tab ${activeTab === 'ONGOING' ? 'active' : ''}`}
                onClick={() => setActiveTab('ONGOING')}
              >
                진행중
              </button>
              <button
                className={`tab ${activeTab === 'DRAFT' ? 'active' : ''}`}
                onClick={() => setActiveTab('DRAFT')}
              >
                미게시
              </button>
              <button
                className={`tab ${activeTab === 'PENDING_ORDER' ? 'active' : ''}`}
                onClick={() => setActiveTab('PENDING_ORDER')}
              >
                구매대기
              </button>
              <button
                className={`tab ${activeTab === 'COMPLETED' ? 'active' : ''}`}
                onClick={() => setActiveTab('COMPLETED')}
              >
                완료된 공구
              </button>
              <button
                className={`tab ${activeTab === 'CANCELED' ? 'active' : ''}`}
                onClick={() => setActiveTab('CANCELED')}
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

          {/* 로딩 */}
          {loading && (
            <div className="loading">불러오는 중...</div>
          )}

          {/* 테이블 */}
          {!loading && (
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={selectedItems.length === gbProducts.length && gbProducts.length > 0}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th>현재 인원</th>
                    <th>상태</th>
                    <th>공구 코드</th>
                    <th>공구명</th>
                    <th>가격</th>
                    <th>시작 날짜</th>
                    <th>종료 날짜</th>
                    <th>작업</th>
                  </tr>
                </thead>
                <tbody>
                  {gbProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(product.id)}
                          onChange={() => handleSelectItem(product.id)}
                        />
                      </td>
                      <td>{product.participants || 0}</td>
                      <td>
                        <span className={`status-badge ${product.status === 'ONGOING' ? 'blue' :
                          product.status === 'DRAFT' ? 'gray' :
                            'green'
                          }`}>
                          {getStatusLabel(product.status)}
                        </span>
                      </td>
                      <td>{product.id}</td>
                      <td className="title-cell">{product.name}</td>
                      <td>{product.price?.toLocaleString()}원</td>
                      <td>{new Date(product.startDate).toLocaleDateString()}</td>
                      <td>{new Date(product.endDate).toLocaleDateString()}</td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <button
                            className="action-btn"
                            onClick={() => handleEdit(product.id)}
                          >
                            수정
                          </button>
                          <button
                            className="action-btn secondary"
                            onClick={() => handleViewParticipants(product.id)}
                          >
                            참여인원
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 데이터가 없을 때 */}
          {!loading && gbProducts.length === 0 && (
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
            {Array.from({ length: pagination.totalPages }, (_, i) => (
              <button
                key={i}
                className={`page-btn ${pagination.page === i ? 'active' : ''}`}
                onClick={() => handlePageChange(i)}
              >
                {i + 1}
              </button>
            ))}
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

      {showParticipantsModal && (
      <ParticipantsModal
        productId={selectedProductId}
        onClose={handleCloseModal}
      />
    )}
    </div>
  );
}