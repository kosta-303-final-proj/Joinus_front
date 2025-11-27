import { useState } from 'react';
import './ProductStatistics.css';

export default function ProductStatistics() {
  const [startDate, setStartDate] = useState('2025-11-01');
  const [endDate, setEndDate] = useState('2025-11-13');
  const [category, setCategory] = useState('전체');
  const [vendor, setVendor] = useState('전체');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortBy, setSortBy] = useState('매출 높은 순');

  // 매출별 Top 상품
  const revenueTopProducts = [
    { name: '에코 아이스박스 세트', revenue: 128500000 },
    { name: '콜드브루 대용량팩', revenue: 75210000 },
    { name: '슬립케어 매트', revenue: 62440000 },
    { name: '프리미엄 홈트 세트', revenue: 58300000 },
    { name: '멀티 주방 수납장', revenue: 41560000 }
  ];

  // 건수별 Top 상품
  const countTopProducts = [
    { name: '데일리 텀블러 4종', count: 4820 },
    { name: '슬립케어 매트', count: 3970 },
    { name: '콜드브루 대용량팩', count: 3420 },
    { name: '멀티 주방 수납장', count: 2640 },
    { name: '에코 아이스박스 세트', count: 2140 }
  ];

  // 수수료별 Top 상품
  const commissionTopProducts = [
    { name: '프리미엄 홈트 세트', commission: 18920000 },
    { name: '에코 아이스박스 세트', commission: 12850000 },
    { name: '콜드브루 대용량팩', commission: 9020000 },
    { name: '슬립케어 매트', commission: 6240000 },
    { name: '멀티 주방 수납장', commission: 4980000 }
  ];

  // 상품 목록 데이터
  const products = [
    {
      code: 'PRD-2025-001',
      name: '에코 아이스박스 세트',
      category: '생활용품',
      vendor: '에코포장연구소',
      revenue: 128500000,
      count: 2140,
      commission: 12850000
    },
    {
      code: 'PRD-2025-002',
      name: '콜드브루 대용량팩',
      category: '식품',
      vendor: '콜드브루팩토리',
      revenue: 75210000,
      count: 3420,
      commission: 9020000
    },
    {
      code: 'PRD-2025-003',
      name: '슬립케어 매트',
      category: '생활용품',
      vendor: '슬립케어랩',
      revenue: 62440000,
      count: 3970,
      commission: 6240000
    },
    {
      code: 'PRD-2025-004',
      name: '프리미엄 홈트 세트',
      category: '디지털/가전',
      vendor: '핏스토리',
      revenue: 58300000,
      count: 1920,
      commission: 9860000
    },
    {
      code: 'PRD-2025-005',
      name: '멀티 주방 수납장',
      category: '주방/식기',
      vendor: '키친웨어컴퍼니',
      revenue: 41560000,
      count: 2640,
      commission: 4980000
    }
  ];

  const formatCurrency = (amount) => {
    return `₩${amount.toLocaleString()}`;
  };

  const handleQuickDate = (type) => {
    const today = new Date();
    const end = new Date(today);
    let start = new Date(today);

    switch (type) {
      case '7days':
        start.setDate(today.getDate() - 7);
        break;
      case '30days':
        start.setDate(today.getDate() - 30);
        break;
      case 'month':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      default:
        return;
    }

    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  return (
    <div className="product-statistics-page">
      {/* 헤더 */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">상품별 통계</h1>
          <p className="page-description">
            기간별 매출/건수/수수료 지표를 상품 단위로 비교합니다.
          </p>
        </div>
        <div className="header-date">
          기준일: 2025-11-13
        </div>
      </div>

      {/* 기간 필터링 */}
      <div className="filter-section">
        <div className="filter-header">
          <h2 className="filter-title">기간 필터링</h2>
          <p className="filter-description">
            조회 기간을 선택하면 상위 상품 랭킹이 업데이트됩니다.
          </p>
        </div>
        <div className="date-filter-row">
          <div className="date-inputs">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="date-input"
            />
            <span className="date-separator">~</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="date-input"
            />
          </div>
          <div className="quick-date-buttons">
            <button
              className="quick-date-btn"
              onClick={() => handleQuickDate('7days')}
            >
              최근 7일
            </button>
            <button
              className="quick-date-btn"
              onClick={() => handleQuickDate('30days')}
            >
              최근 30일
            </button>
            <button
              className="quick-date-btn"
              onClick={() => handleQuickDate('month')}
            >
              이번 달
            </button>
            <button className="quick-date-btn">
              직접 설정
            </button>
          </div>
        </div>
      </div>

      {/* Top 상품 랭킹 */}
      <div className="top-products-section">
        <div className="top-product-card">
          <h3 className="top-product-title">매출별 Top 상품</h3>
          <div className="top-product-list">
            {revenueTopProducts.map((product, index) => (
              <div key={index} className="top-product-item">
                <div className="product-name">{product.name}</div>
                <div className="product-value">매출 {formatCurrency(product.revenue)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="top-product-card">
          <h3 className="top-product-title">건수별 매출 Top 상품</h3>
          <div className="top-product-list">
            {countTopProducts.map((product, index) => (
              <div key={index} className="top-product-item">
                <div className="product-name">{product.name}</div>
                <div className="product-value">결제건수 {product.count.toLocaleString()}건</div>
              </div>
            ))}
          </div>
        </div>

        <div className="top-product-card">
          <h3 className="top-product-title">수수료별 매출 Top 상품</h3>
          <div className="top-product-list">
            {commissionTopProducts.map((product, index) => (
              <div key={index} className="top-product-item">
                <div className="product-name">{product.name}</div>
                <div className="product-value">수수료 {formatCurrency(product.commission)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 검색 조건 필터링 */}
      <div className="search-filter-section">
        <div className="filter-header">
          <h2 className="filter-title">검색 조건 필터링</h2>
          <p className="filter-description">
            상품, 카테고리, 납품업체 조건을 추가로 지정해 세부 데이터를 확인하세요.
          </p>
        </div>
        <div className="search-filter-row">
          <div className="filter-group">
            <label>카테고리</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="filter-select"
            >
              <option value="전체">전체</option>
              <option value="생활용품">생활용품</option>
              <option value="식품">식품</option>
              <option value="주방/식기">주방/식기</option>
              <option value="디지털/가전">디지털/가전</option>
            </select>
          </div>
          <div className="filter-group">
            <label>납품업체</label>
            <select
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              className="filter-select"
            >
              <option value="전체">전체</option>
              <option value="에코포장연구소">에코포장연구소</option>
              <option value="콜드브루팩토리">콜드브루팩토리</option>
              <option value="슬립케어랩">슬립케어랩</option>
              <option value="핏스토리">핏스토리</option>
              <option value="키친웨어컴퍼니">키친웨어컴퍼니</option>
            </select>
          </div>
          <div className="filter-group">
            <label>상품명 또는 SKU 검색</label>
            <input
              type="text"
              placeholder="상품명 또는 SKU 입력"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-group">
            <label>정렬</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="매출 높은 순">매출 높은 순</option>
              <option value="매출 낮은 순">매출 낮은 순</option>
              <option value="건수 높은 순">건수 높은 순</option>
              <option value="건수 낮은 순">건수 낮은 순</option>
            </select>
          </div>
          <button className="search-button">조회</button>
        </div>
      </div>

      {/* 상품 목록 테이블 */}
      <div className="products-table-section">
        <div className="table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>상품코드</th>
                <th>상품명</th>
                <th>카테고리</th>
                <th>납품업체</th>
                <th>매출</th>
                <th>결제건수</th>
                <th>수수료</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index}>
                  <td>{product.code}</td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.vendor}</td>
                  <td className="number-cell">{formatCurrency(product.revenue)}</td>
                  <td className="number-cell">{product.count.toLocaleString()}건</td>
                  <td className="number-cell">{formatCurrency(product.commission)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-notes">
          <p>- 상세 지표(평균 객단가, 전월 대비 증감 등)는 추후 열 추가 또는 엑셀 다운로드에서 제공할 수 있습니다.</p>
          <p>- 검색 조건을 즐겨찾기로 저장해 정기 리포트에 활용하세요.</p>
        </div>
      </div>
    </div>
  );
}
