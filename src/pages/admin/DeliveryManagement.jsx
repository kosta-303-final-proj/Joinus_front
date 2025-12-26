import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { myAxios } from '../../config';
import AdminHeader from '../../components/layout/AdminHeader';
import './DeliveryManagement.css';

export default function DeliveryManagement() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    startDate: '2025-11-01',
    endDate: '2025-11-13',
    status: '전체',
    category: '전체'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [categories, setCategories] = useState([]);

  // 카테고리 목록 조회
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await myAxios().get('/admin/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('카테고리 조회 실패:', error);
      }
    };
    fetchCategories();
  }, []);

  // 더미 데이터 (12개로 확장)
  const allDeliveryList = [
    {
      id: 1,
      companyName: '친환경용품 상사',
      businessNumber: '123-45-67890',
      category: '생활용품',
      manager: '김지연 과장',
      phone: '010-1111-2222',
      email: 'eco@example.com',
      receivedDate: '2025-10-15',
      status: '승인 대기'
    },
    {
      id: 2,
      companyName: '해외직구 트레이딩',
      businessNumber: '234-56-78901',
      category: '가전/기타',
      manager: '박서윤 부장',
      phone: '010-2222-3333',
      email: 'global@example.com',
      receivedDate: '2025-11-05',
      status: '보류'
    },
    {
      id: 3,
      companyName: '생활용품 유통',
      businessNumber: '345-67-89012',
      category: '생활용품',
      manager: '이현우 대표',
      phone: '010-3333-4444',
      email: 'life@example.com',
      receivedDate: '2025-09-20',
      status: '승인'
    },
    {
      id: 4,
      companyName: '주방용품 전문',
      businessNumber: '456-78-90123',
      category: '주방/식기',
      manager: '최민수 과장',
      phone: '010-4444-5555',
      email: 'kitchen@example.com',
      receivedDate: '2025-11-10',
      status: '승인 대기'
    },
    {
      id: 5,
      companyName: '식품 유통사',
      businessNumber: '567-89-01234',
      category: '식품',
      manager: '정수진 부장',
      phone: '010-5555-6666',
      email: 'food@example.com',
      receivedDate: '2025-11-08',
      status: '승인 대기'
    },
    {
      id: 6,
      companyName: '가전제품 도매',
      businessNumber: '678-90-12345',
      category: '가전/기타',
      manager: '한지훈 대표',
      phone: '010-6666-7777',
      email: 'appliance@example.com',
      receivedDate: '2025-11-01',
      status: '보류'
    },
    {
      id: 7,
      companyName: '생활잡화 마트',
      businessNumber: '789-01-23456',
      category: '생활용품',
      manager: '윤서아 과장',
      phone: '010-7777-8888',
      email: 'daily@example.com',
      receivedDate: '2025-10-28',
      status: '승인'
    },
    {
      id: 8,
      companyName: '친환경 패키징',
      businessNumber: '890-12-34567',
      category: '생활용품',
      manager: '강도현 부장',
      phone: '010-8888-9999',
      email: 'eco2@example.com',
      receivedDate: '2025-11-12',
      status: '승인 대기'
    },
    {
      id: 9,
      companyName: '주방도구 전문점',
      businessNumber: '901-23-45678',
      category: '주방/식기',
      manager: '임태영 대표',
      phone: '010-9999-0000',
      email: 'cookware@example.com',
      receivedDate: '2025-11-11',
      status: '승인 대기'
    },
    {
      id: 10,
      companyName: '건강식품 유통',
      businessNumber: '012-34-56789',
      category: '식품',
      manager: '오지은 과장',
      phone: '010-0000-1111',
      email: 'health@example.com',
      receivedDate: '2025-11-09',
      status: '승인 대기'
    },
    {
      id: 11,
      companyName: '전자제품 수입',
      businessNumber: '123-45-67891',
      category: '가전/기타',
      manager: '배성호 부장',
      phone: '010-1111-2222',
      email: 'electronics@example.com',
      receivedDate: '2025-11-07',
      status: '승인'
    },
    {
      id: 12,
      companyName: '생활소품 전문',
      businessNumber: '234-56-78902',
      category: '생활용품',
      manager: '신유나 대표',
      phone: '010-2222-3333',
      email: 'lifestyle@example.com',
      receivedDate: '2025-11-13',
      status: '승인 대기'
    }
  ];

  // 페이지네이션 계산
  const totalPages = Math.ceil(allDeliveryList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const deliveryList = allDeliveryList.slice(startIndex, endIndex);

  const stats = {
    today: 3,
    pending: 12,
    onHold: 2,
    approvedThisMonth: 5
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    console.log('조회:', filters);
    // 실제 조회 로직
  };

  const handleApprove = (id) => {
    console.log('승인:', id);
    // 실제 승인 로직
    alert('승인 처리되었습니다.');
  };

  const handleHold = (id) => {
    console.log('보류:', id);
    // 실제 보류 로직
    alert('보류 처리되었습니다.');
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case '승인 대기':
        return 'status-pending';
      case '보류':
        return 'status-hold';
      case '승인':
        return 'status-approved';
      default:
        return '';
    }
  };

  return (
    <div className="admin-layout">
      <div className="main-content">
        <AdminHeader title="납품 관리" />
        <div className="content-area">
    <div className="delivery-management-page">
      {/* 헤더 */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">납품 관리</h1>
          <p className="page-description">
            승인 대기 중인 납품 제안을 확인하고 승인/반려 처리합니다.
          </p>
        </div>
        <div className="header-date">
          기준일: 2025-11-13
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-label">오늘 접수</div>
          <div className="stat-value">{stats.today}건</div>
          <div className="stat-note">최근 24시간 이내 유입된 신청입니다.</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">승인 대기</div>
          <div className="stat-value">{stats.pending}건</div>
          <div className="stat-note">검토 완료 후 승인 또는 반려 처리하세요.</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">보류 중</div>
          <div className="stat-value">{stats.onHold}건</div>
          <div className="stat-note">추가 자료 요청 등 사유를 메모에 기록하세요.</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">이번 달 승인</div>
          <div className="stat-value">{stats.approvedThisMonth}건</div>
          <div className="stat-note">승인된 업체는 파트너 관리 화면으로 이동합니다.</div>
        </div>
      </div>

      {/* 필터 섹션 */}
      <div className="filter-section">
        <div className="filter-row">
          <div className="filter-group">
            <label>신청자 / 업체명</label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="업체명, 사업자번호, 담당자 검색"
            />
          </div>
          <div className="filter-group">
            <label>접수일</label>
            <div className="date-range">
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
              <span>~</span>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
              />
            </div>
          </div>
          <div className="filter-group">
            <label>상태</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="전체">전체</option>
              <option value="승인 대기">승인 대기</option>
              <option value="보류">보류</option>
              <option value="승인">승인</option>
            </select>
          </div>
          <div className="filter-group">
            <label>카테고리</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="전체">전체</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <button className="search-button" onClick={handleSearch}>
            조회
          </button>
        </div>
      </div>

      {/* 납품 목록 */}
      <div className="list-section">
        <div className="list-header">
          <h2 className="list-title">납품 목록</h2>
          <span className="list-count">총 {allDeliveryList.length}개 업체</span>
        </div>
        <div className="table-container">
          <table className="delivery-table">
            <thead>
              <tr>
                <th>업체명</th>
                <th>사업자 번호</th>
                <th>주요 카테고리</th>
                <th>담당자</th>
                <th>담당자 연락처</th>
                <th>이메일</th>
                <th>접수일</th>
                <th>상태</th>
                <th>처리</th>
              </tr>
            </thead>
            <tbody>
              {deliveryList.map((item) => (
                <tr key={item.id}>
                  <td>
                    <a 
                      href={`/admin/delivery/${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/admin/delivery/${item.id}`);
                      }}
                      className="company-name-link"
                    >
                      {item.companyName}
                    </a>
                  </td>
                  <td>{item.businessNumber}</td>
                  <td>{item.category}</td>
                  <td>{item.manager}</td>
                  <td>{item.phone}</td>
                  <td>{item.email}</td>
                  <td>{item.receivedDate}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    {item.status === '승인 대기' && (
                      <div className="action-buttons">
                        <button
                          className="btn-approve"
                          onClick={() => handleApprove(item.id)}
                        >
                          승인
                        </button>
                        <button
                          className="btn-hold"
                          onClick={() => handleHold(item.id)}
                        >
                          보류
                        </button>
                      </div>
                    )}
                    {item.status === '보류' && (
                      <div className="action-buttons">
                        <button
                          className="btn-approve"
                          onClick={() => handleApprove(item.id)}
                        >
                          승인
                        </button>
                      </div>
                    )}
                    {item.status === '승인' && (
                      <span className="no-action">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* 페이지네이션 */}
        <div className="pagination">
          <button
            className="pagination-button"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            이전
          </button>
          <div className="pagination-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            className="pagination-button"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            다음
          </button>
        </div>

        <p className="list-note">
          · 자세한 업체 정보, 납품 이력 등은 추후 상세 페이지(또는 모달)로 연결할 수 있습니다.
        </p>
      </div>
    </div>
        </div>
      </div>
    </div>
  );
}

