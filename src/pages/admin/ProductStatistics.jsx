import { useState, useEffect } from 'react';
import { apiFetch, myAxios } from '../../config';
import AdminHeader from '../../components/layout/AdminHeader';
import './ProductStatistics.css';

export default function ProductStatistics() {
  // 초기 날짜 설정 (최근 30일)
  const getInitialDates = () => {
    const today = new Date();
    const end = new Date(today);
    const start = new Date(today);
    start.setDate(today.getDate() - 30);
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    };
  };

  const initialDates = getInitialDates();
  const [startDate, setStartDate] = useState(initialDates.start);
  const [endDate, setEndDate] = useState(initialDates.end);
  const [category, setCategory] = useState('전체');
  const [vendor, setVendor] = useState('전체');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortBy, setSortBy] = useState('매출 높은 순');
  const [categories, setCategories] = useState([]);

  // API 데이터 상태
  const [productStatisticsData, setProductStatisticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // API 호출 함수
  const fetchProductStatistics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        startDate,
        endDate,
        category: category === '전체' ? '' : category,
        vendor: vendor === '전체' ? '' : vendor,
        keyword: searchKeyword,
        sortBy
      });
      const response = await apiFetch(`/api/admin/statistics/product?${params}`);
      if (!response.ok) {
        throw new Error('상품별 통계 데이터 조회 실패');
      }
      const data = await response.json();
      setProductStatisticsData(data);
    } catch (err) {
      console.error('상품별 통계 데이터 조회 실패:', err);
      setError('데이터를 불러올 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 로드
  useEffect(() => {
    fetchProductStatistics();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 조회 버튼 클릭 핸들러
  const handleSearch = () => {
    fetchProductStatistics();
  };

  // 빠른 날짜 선택 핸들러
  const handleQuickDate = async (type) => {
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

    const newStartDate = start.toISOString().split('T')[0];
    const newEndDate = end.toISOString().split('T')[0];
    
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    
    // 날짜 변경 후 API 호출
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        startDate: newStartDate,
        endDate: newEndDate,
        category: category === '전체' ? '' : category,
        vendor: vendor === '전체' ? '' : vendor,
        keyword: searchKeyword,
        sortBy
      });
      const response = await apiFetch(`/api/admin/statistics/product?${params}`);
      if (!response.ok) {
        throw new Error('상품별 통계 데이터 조회 실패');
      }
      const data = await response.json();
      setProductStatisticsData(data);
    } catch (err) {
      console.error('상품별 통계 데이터 조회 실패:', err);
      setError('데이터를 불러올 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 데이터 추출 (null 체크 포함)
  const revenueTopProducts = productStatisticsData?.revenueTopProducts || [];
  const countTopProducts = productStatisticsData?.countTopProducts || [];
  const commissionTopProducts = productStatisticsData?.commissionTopProducts || [];
  const products = productStatisticsData?.products || [];

  const formatCurrency = (amount) => {
    return `₩${amount.toLocaleString()}`;
  };

  // 로딩 상태
  if (isLoading && !productStatisticsData) {
    return (
      <div className="product-statistics-page">
        <div className="loading" style={{ padding: '2rem', textAlign: 'center' }}>로딩 중...</div>
      </div>
    );
  }

  // 에러 상태
  if (error && !productStatisticsData) {
    return (
      <div className="product-statistics-page">
        <div className="error" style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>{error}</div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <div className="main-content">
        <AdminHeader title="상품별 통계" />
        <div className="content-area">
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
          기준일: {new Date().toISOString().slice(0, 10)}
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
              disabled={isLoading}
            >
              최근 7일
            </button>
            <button
              className="quick-date-btn"
              onClick={() => handleQuickDate('30days')}
              disabled={isLoading}
            >
              최근 30일
            </button>
            <button
              className="quick-date-btn"
              onClick={() => handleQuickDate('month')}
              disabled={isLoading}
            >
              이번 달
            </button>
            <button 
              className="quick-date-btn"
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? '조회 중...' : '조회'}
            </button>
          </div>
        </div>
      </div>

      {/* Top 상품 랭킹 */}
      <div className="top-products-section">
        <div className="top-product-card">
          <h3 className="top-product-title">매출별 Top 상품</h3>
          <div className="top-product-list">
            {revenueTopProducts.length > 0 ? (
              revenueTopProducts.map((product, index) => (
                <div key={index} className="top-product-item">
                  <div className="product-name">{product.name || '-'}</div>
                  <div className="product-value">매출 {formatCurrency(product.revenue || 0)}</div>
                </div>
              ))
            ) : (
              <div className="no-data">데이터가 없습니다.</div>
            )}
          </div>
        </div>

        <div className="top-product-card">
          <h3 className="top-product-title">건수별 매출 Top 상품</h3>
          <div className="top-product-list">
            {countTopProducts.length > 0 ? (
              countTopProducts.map((product, index) => (
                <div key={index} className="top-product-item">
                  <div className="product-name">{product.name || '-'}</div>
                  <div className="product-value">결제건수 {(product.count || 0).toLocaleString()}건</div>
                </div>
              ))
            ) : (
              <div className="no-data">데이터가 없습니다.</div>
            )}
          </div>
        </div>

        <div className="top-product-card">
          <h3 className="top-product-title">수수료별 매출 Top 상품</h3>
          <div className="top-product-list">
            {commissionTopProducts.length > 0 ? (
              commissionTopProducts.map((product, index) => (
                <div key={index} className="top-product-item">
                  <div className="product-name">{product.name || '-'}</div>
                  <div className="product-value">수수료 {formatCurrency(product.commission || 0)}</div>
                </div>
              ))
            ) : (
              <div className="no-data">데이터가 없습니다.</div>
            )}
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
        <div className="product-search-filter-row">
          <div className="product-filter-group">
            <label>카테고리</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="product-filter-select"
            >
              <option value="전체">전체</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="product-filter-group">
            <label>납품업체</label>
            <select
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              className="product-filter-select"
            >
              <option value="전체">전체</option>
              <option value="에코포장연구소">에코포장연구소</option>
              <option value="콜드브루팩토리">콜드브루팩토리</option>
              <option value="슬립케어랩">슬립케어랩</option>
              <option value="핏스토리">핏스토리</option>
              <option value="키친웨어컴퍼니">키친웨어컴퍼니</option>
            </select>
          </div>
          <div className="product-filter-group">
            <label>상품명 또는 SKU 검색</label>
            <input
              type="text"
              placeholder="상품명 또는 SKU 입력"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="product-filter-input"
            />
          </div>
          <div className="product-filter-group">
            <label>정렬</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="product-filter-select"
            >
              <option value="매출 높은 순">매출 높은 순</option>
              <option value="매출 낮은 순">매출 낮은 순</option>
              <option value="건수 높은 순">건수 높은 순</option>
              <option value="건수 낮은 순">건수 낮은 순</option>
            </select>
          </div>
          <button className="product-filter-button" onClick={handleSearch} disabled={isLoading}>
            {isLoading ? '조회 중...' : '조회'}
          </button>
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
              {products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data">데이터가 없습니다.</td>
                </tr>
              ) : (
                products.map((product, index) => (
                  <tr key={index}>
                    <td>{product.code || '-'}</td>
                    <td>{product.name || '-'}</td>
                    <td>{product.category || '-'}</td>
                    <td>{product.vendor || '-'}</td>
                    <td className="number-cell">{formatCurrency(product.revenue || 0)}</td>
                    <td className="number-cell">{(product.count || 0).toLocaleString()}건</td>
                    <td className="number-cell">{formatCurrency(product.commission || 0)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="table-notes">
          <p>- 상세 지표(평균 객단가, 전월 대비 증감 등)는 추후 열 추가 또는 엑셀 다운로드에서 제공할 수 있습니다.</p>
          <p>- 검색 조건을 즐겨찾기로 저장해 정기 리포트에 활용하세요.</p>
        </div>
      </div>
    </div>
        </div>
      </div>
    </div>
  );
}
